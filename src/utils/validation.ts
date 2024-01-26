import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationException } from "./errors";
import { plainToInstance } from "class-transformer";

export type ClassType<T> = { new(...args: any[]): T; }

export function BodyValidation<T>(target: ClassType<T>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        req.body = plainToInstance(target, req.body);
        const errors = await validate(req.body, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0)
            throw new ValidationException(errors.map(error => ({ ...error, target: undefined, value: undefined })));

        next();
    }
}