"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Switch } from "./ui/switch";
import { useGetAllTasksQuery } from "@/lib/client/services";
import { format } from "date-fns/format";
import { EditTaskDialog } from "./editTaskDialog";
import { ITask, Status } from "@/models/taskModels";
import { useUpdateTaskMutation } from "@/lib/client/services";

export function TaskList() {
    const {data: tasks} = useGetAllTasksQuery();

    const [updateTask, {isLoading}] = useUpdateTaskMutation();

    const handleTaskComplete = async(task: ITask, checked: boolean)=>{
        await updateTask({
            ...task,
            status: checked? Status.DONE : Status.INCOMPLETE
        });
    }

    return (
        <Table>
            <TableCaption>All Tasks</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="text-right pr-8">Edit</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks?.map((task:ITask) => (
                    <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>
                            <Switch
                                checked={task.status==="DONE"}
                                onCheckedChange={(checked) => handleTaskComplete(task, checked)}
                                disabled={isLoading}
                            />
                        </TableCell>
                        <TableCell >{format(task.due, "dd/MM/yyyy hh:mm aa")}</TableCell>
                        <TableCell className="text-right">
                            <EditTaskDialog taskId={task.id}/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}