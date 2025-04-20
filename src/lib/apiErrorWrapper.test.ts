import { NextRequest } from "next/server";
import {handleError} from "./apiErrorWrapper";
import {Prisma} from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

it("Handles Prisma P2018 with 404", async() => {
    const mockFn = jest.fn().mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
        "NOT FOUND", {code: "P2018", clientVersion: "0"}
    ))
    const handler = handleError(mockFn);
    const requestObj = mockDeep<NextRequest>();
    const response = await handler(requestObj);
    expect(response.status).toBe(404);
});

it("Handles unknown error", async() => {
    const mockFn = jest.fn().mockRejectedValue("unknown error");
    const handler = handleError(mockFn);
    const requestObj = mockDeep<NextRequest>();
    const response = await handler(requestObj);
    expect(response.status).toBe(500);
});