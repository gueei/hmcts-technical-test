/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateErrorMessage } from "zod-error";

import {prismaError} from "prisma-better-errors";
import { Prisma } from "@prisma/client";


type TApiMethod = (request: NextRequest, params?: any) => Promise<NextResponse>;

export const handleError = (apiMethod: TApiMethod) => {
    return async (req: NextRequest, params?: any) => {
        try {
            return await apiMethod(req, params);
        } catch (error) {
            if (error instanceof ZodError) {
                return NextResponse.json({
                    message: generateErrorMessage(error.issues)
                }, { status: 400 })
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError){
                const err = new prismaError(error)
                return NextResponse.json({
                    message: err.message,
                }, {status: err.statusCode });
            }
            return NextResponse.json({
                message: "Unknown server error"
            }, { status: 500 })
        }
    }
}