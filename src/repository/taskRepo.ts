import prisma from '@/prisma/client';
import { ICreateTask, Status, ITask } from '@/models/taskModels';

export async function createTask(task: ICreateTask) {
    return await prisma.task.create({
        data: {...task,
            status: (task.status as Status)
        }
    })
}

export async function getTaskById(id: string) {
    return await prisma.task.findUniqueOrThrow({
        where: {
            id
        }
    })
}

export async function updateTask(id: string, task: ITask){
    return await prisma.task.update({
        where: {id},
        data: {
            ...task
        }
    })
}

export async function getAllTasks() {
    const result= await prisma.task.findMany({
        orderBy: [{
            due: "asc",
        }, {
            title: "asc",
        }]
    });
    return result
}

export async function deleteTask(id: string){
    return await prisma.task.delete({
        where: {id}
    });
}