import { GET, POST, DELETE } from "./route"
import { prismaMock } from "../../../prisma/prismaMock";
import { faker } from "@faker-js/faker";
import { Status } from "@prisma/client";
import { NextRequest } from "next/server";
import { mockDeep } from "jest-mock-extended";
import { Prisma } from "@prisma/client";

const tasks = [...Array(5)].map(() => ({
    id: faker.string.uuid(),
    title: faker.string.alpha(10),
    description: faker.string.alphanumeric({
        length: {
            min: 0, max: 100
        }
    }),
    status: Status.INCOMPLETE,
    due: faker.date.future()
}));

const editedTask = {
    ...tasks[0],
    title: faker.string.alpha(5),
    status: Status.DONE
}

beforeEach(() => {
    prismaMock.task.findMany.mockResolvedValue(tasks);
    prismaMock.task.findUniqueOrThrow.mockResolvedValue(tasks[0]);
    prismaMock.task.update.mockResolvedValue(editedTask);
})

it("Get detail of a task", async () => {
    const requestObj = mockDeep<NextRequest>();
    const paramObj = {
        params: Promise.resolve({id: editedTask.id})
    }
    requestObj.json.mockResolvedValue(tasks[0]);

    const response = await GET(requestObj, paramObj);
    expect(response.status).toBe(200);
});

it("Update Task successfully", async() => {
    const requestObj = mockDeep<NextRequest>();
    const paramObj = {
        params: Promise.resolve({id: editedTask.id})
    }
    prismaMock.task.update.mockResolvedValue(editedTask);
    requestObj.json.mockResolvedValue(editedTask);

    const response = await POST(requestObj, paramObj);
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toHaveProperty("id");
});

it("Successfully delete task", async()=>{
    const requestObj = mockDeep<NextRequest>();
    const paramObj = {
        params: Promise.resolve({id: editedTask.id})
    }
    prismaMock.task.delete.mockResolvedValue(editedTask);
    requestObj.json.mockResolvedValue(editedTask);

    const response = await DELETE(requestObj, paramObj);
    expect(response.status).toBe(200);
})

it("Failed to get a task with wrong ID", async () => {
    const requestObj = mockDeep<NextRequest>();
    const paramObj = {
        params: Promise.resolve({id: "FJLDSKJFKSD"})
    }
    prismaMock.task.findUniqueOrThrow.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
            "not found", {code: "P2018", clientVersion: "0"}
        )
    );
    
    const response = await GET(requestObj, paramObj);
    expect(response.status).toBe(404);
});

it("Failed to update task with invalid ID", async() => {
    const requestObj = mockDeep<NextRequest>();
    const paramObj = {
        params: Promise.resolve({id: "FJLDSKJFKSD"})
    }
    prismaMock.task.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
            "not found", {code: "P2018", clientVersion: "0"}
        )
    );
    requestObj.json.mockResolvedValue(editedTask);

    const response = await POST(requestObj, paramObj);
    expect(response.status).toBe(404);
});

it("Failed to update task with invalid data", async() => {
    const requestObj = mockDeep<NextRequest>();
    const paramObj = {
        params: Promise.resolve({id: editedTask.id})
    }
    requestObj.json.mockResolvedValue({
        ...editedTask,
        status: "INVALID"
    });
    const response = await POST(requestObj, paramObj);
    expect(response.status).toBe(400);
});