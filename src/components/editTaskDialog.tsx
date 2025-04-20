"use client";

import * as React from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns"
import { useGetTaskByIdQuery, useUpdateTaskMutation, useDeleteTaskMutation } from "@/lib/client/services";
import { Status } from "@/models/taskModels";
import { DateTimePicker } from "./ui/dateTimicker";

const updateTaskSchema = z.object({
    id: z.string(),
    title: z.string().min(3),
    description: z.string().nullable(),
    status: z.nativeEnum(Status),
    due: z.date().min(new Date(), "Due date must be after today"),
});

export function EditTaskDialog({ taskId }: { taskId: string }) {
    const [createTask, { isLoading }] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [open, setOpen] = React.useState(false);

    const { data: task, isLoading: loadingTask } = useGetTaskByIdQuery(taskId, { skip: !open });


    const form = useForm<z.infer<typeof updateTaskSchema>>({
        values: task ? { ...task, description: task.description ?? null, due: new Date(task.due) } : undefined,
        resolver: zodResolver(updateTaskSchema)
    });

    async function onSubmit(data: z.infer<typeof updateTaskSchema>) {
        await createTask(data).unwrap();
        setOpen(false);
    }

    async function handleDelete() {
        if (task) {
            await deleteTask(task.id).unwrap();
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit: {task?.title} </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="col-span-1">Title</FormLabel>
                                    <FormControl className="col-span-3">
                                        <Input {...field} value={field.value ?? ""} disabled={loadingTask} />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="col-span-1">Description</FormLabel>
                                    <FormControl className="col-span-3">
                                        <Textarea {...field} value={field.value ?? ""} disabled={loadingTask} />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="col-span-1">Status {JSON.stringify(field.value)}</FormLabel>
                                    <FormControl className="col-span-3">
                                        <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={loadingTask}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(Status).map((value) => (
                                                    <SelectItem value={value} key={value}>{value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="due"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="col-span-1">Due</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            className="col-span-3"
                                            date={field.value}
                                            onChange={field.onChange}
                                            dtFormat="PPP hh:mm aa"
                                        />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )} />
                        <div className="grid grid-cols-4 gap-4">
                            <Button onClick={handleDelete} className="col-span-1" type="button" variant="destructive" disabled={isLoading || loadingTask}>Delete</Button>
                            <Button className="col-span-3" type="submit" disabled={isLoading || loadingTask || !form.formState.isDirty}>Save changes</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
