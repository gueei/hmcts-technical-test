import { GET, PUT } from "@/app/api/route"
import { prismaMock } from "../../prisma/prismaMock";
import { faker } from "@faker-js/faker";
import { Status } from "@prisma/client";
import { NextRequest } from "next/server";
import { mockDeep } from "jest-mock-extended";

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

const newTask = {
    title: faker.string.alpha(10),
    description: faker.string.alphanumeric({
        length: {
            min: 0, max: 100
        }
    }),
    status: Status.INCOMPLETE,
    due: faker.date.future(),
    id: faker.string.uuid()
};

beforeAll(() => {

    prismaMock.task.findMany.mockResolvedValue(tasks);
    prismaMock.task.create.mockResolvedValue(newTask);
})

it("Should return data with status 200", async () => {
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.length).toBe(5);
});

it("Should add new task", async () => {
    const requestObj = mockDeep<NextRequest>();
    requestObj.json.mockResolvedValue(newTask);

    const response = await PUT(requestObj)
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(JSON.stringify(body)).toBe(JSON.stringify(newTask));
});


it("Should not add new task when date is before today", async () => {
    const requestObj = mockDeep<NextRequest>();
    requestObj.json.mockResolvedValue({
        ...newTask,
        due: faker.date.past({ years: 10 })
    });
    const response = await PUT(requestObj);
    expect(response.status).toBe(400);
    expect(response.body).not.toBeNull();
});