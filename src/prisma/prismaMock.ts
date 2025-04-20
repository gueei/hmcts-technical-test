import { PrismaClient, Status } from "@prisma/client";
import {mockDeep, DeepMockProxy } from "jest-mock-extended";
import prisma from "@/prisma/client";

jest.mock("@/prisma/client", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
    Status
}));

beforeEach(() => {
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
