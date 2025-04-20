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
import { Spinner } from "./ui/spinner";

export function TaskList() {
    const { data: tasks, isLoading: loadingList, isFetching: updatingList } = useGetAllTasksQuery();

    const [updateTask, { isLoading: taskUpdating }] = useUpdateTaskMutation();

    const handleTaskComplete = async (task: ITask, checked: boolean) => {
        await updateTask({
            ...task,
            status: checked ? Status.DONE : Status.INCOMPLETE
        });
    }

    if (loadingList)
        return (
            <div className="flex flex-row w-full items-center">
                <Spinner className="" size="large" />
            </div>
        )

    return (
        <div className="flex flex-row w-full flex-wrap gap-2">
            {tasks?.map((task: ITask) => (
                <Card className="sm:w-1/2 md:w-1/4 lg:w-1/5" key={task.id}>
                    <CardHeader>
                        <CardTitle>{task.title}</CardTitle>
                        <CardDescription>{format(task.due, "PPP mm:hh aa")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Label>{task.description}</Label>
                        <div className="flex flex-row gap-2">
                            <Switch id={`toggle-task-complete_${task.id}`} disabled={taskUpdating || updatingList} onCheckedChange={(checked) => handleTaskComplete(task, checked)} />
                            <Label htmlFor={`toggle-task-complete_${task.id}`}>Completed</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <EditTaskDialog taskId={task.id} disabled={taskUpdating || updatingList} />
                    </CardFooter>
                </Card >
            ))}
        </div>
    )
}