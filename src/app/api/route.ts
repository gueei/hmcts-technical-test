import { NextRequest, NextResponse } from "next/server";
import { getAllTasks } from "@/repository/taskRepo";
import * as taskRepo from "@/repository/taskRepo";
import { createTaskSchema } from "@/models/taskModels";
import { handleError } from "@/lib/apiErrorWrapper";

export const GET = handleError(async () => {
    return NextResponse.json(await getAllTasks());
});

export const PUT = handleError(async (request: NextRequest) => {
    const json = await request.json();
    const task = createTaskSchema.parse(json);
    return NextResponse.json(
        await taskRepo.createTask(task),
        { status: 201 },
    );
});