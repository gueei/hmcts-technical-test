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
import { useNewTaskMutation } from "@/lib/client/services";
import { createTaskSchema, ICreateTask } from "@/models/taskModels";
import {add} from "date-fns";
import { DateTimePicker } from "./ui/dateTimicker";

export function AddNewTaskDialog() {

    const [createTask, {isLoading}] = useNewTaskMutation();

    const form = useForm({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            due: add(new Date(), {days: 1})
        }
    });

    async function onSubmit(data: ICreateTask) {
        await createTask(data).unwrap();
        setOpen(false);
    }

    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">New Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
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
                                        <Input {...field} />
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
                                        <Textarea {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name={"due"}
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
                        <Button type="submit" disabled={isLoading}>Save changes</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
