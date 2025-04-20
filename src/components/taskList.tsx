"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "./ui/switch";
import { useGetAllTasksQuery } from "@/lib/client/services";
import { format } from "date-fns/format";
import { EditTaskDialog } from "./editTaskDialog";
import { ITask, Status } from "@/models/taskModels";
import { useUpdateTaskMutation } from "@/lib/client/services";
import { Label } from "./ui/label";

export function TaskList() {
    const { data: tasks } = useGetAllTasksQuery();

    const [updateTask, { isLoading }] = useUpdateTaskMutation();

    const handleTaskComplete = async (task: ITask, checked: boolean) => {
        await updateTask({
            ...task,
            status: checked ? Status.DONE : Status.INCOMPLETE
        });
    }

    return (
        <div className="flex flex-row w-full flex-wrap gap-2">
            {tasks?.map((task: ITask) => (
                <Card className="sm:w-1/2 md:w-1/4 lg:w-1/5" key={task.id}>
                    <CardHeader>
                        <CardTitle>{task.title}</CardTitle>
                        <CardDescription>{task.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-2">
                        <Switch id={`toggle-task-complete_${task.id}`} disabled={isLoading} onCheckedChange={(checked) => handleTaskComplete(task, checked)}/>
                            <Label htmlFor={`toggle-task-complete_${task.id}`}>Completed</Label>
                    </CardContent>
                    <CardFooter>
                        <EditTaskDialog taskId={task.id} />
                    </CardFooter>
                </Card >
            ))}
        </div>
    )
}