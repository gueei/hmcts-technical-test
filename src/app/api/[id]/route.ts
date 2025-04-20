import { NextRequest, NextResponse } from "next/server";
import { getTaskById, updateTask, deleteTask } from "@/repository/taskRepo";
import { handleError } from "@/lib/apiErrorWrapper";
import { taskSchema } from "@/models/taskModels";


export const GET = handleError(async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const task = await getTaskById(id);
    return NextResponse.json(task);
});

export const POST = handleError(
    async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params
        const task = await request.json();
        const taskParsed = taskSchema.parse(task);
        return NextResponse.json(await updateTask(id, taskParsed));
});

export const DELETE = handleError(
    async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params
        return NextResponse.json(await deleteTask(id),
        {status: 200}
    );
});