import { createTask } from "@/repository/taskRepo";
import {Status} from "@prisma/client";
import { prismaMock } from "../prisma/prismaMock";

test("should create new task", async()=>{
    const task = {
        title: "MOCKABC",
        description: "DEF",
        status: Status.DONE,
        due: new Date(), 
        id: "1"
    };
    prismaMock.task.create.mockResolvedValue({...task, id: "1"})
    await expect(createTask(task)).resolves.toEqual(task);
});

