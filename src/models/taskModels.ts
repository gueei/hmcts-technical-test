import {Status} from '@prisma/client';
import {z} from "zod";
export {Status} from '@prisma/client';

export const createTaskSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional().nullable(),
    status: z.nativeEnum(Status).default("INCOMPLETE"),
    due: z.coerce.date().min(new Date)
});

export const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional().nullable(),
    status: z.nativeEnum(Status),
    due: z.coerce.date()
});

export type ICreateTask = z.infer<typeof createTaskSchema>;
export type ITask = z.infer<typeof taskSchema>;