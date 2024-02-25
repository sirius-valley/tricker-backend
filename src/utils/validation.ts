import { validate } from 'class-validator';
import { type NextFunction, type Request, type Response } from 'express';
import { ValidationException } from './errors';
import { plainToInstance } from 'class-transformer';

export type ClassType<T> = new (...args: any[]) => T;

type RequestPart = 'body' | 'query' | 'params';

export function validateRequest<T>(target: ClassType<T>, reqKey: RequestPart) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(target, req[reqKey] as T);
    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new ValidationException(
        errors.map((error) => ({
          ...error,
          target: undefined,
          value: undefined,
        }))
      );
    }

    req[reqKey] = instance;
    next();
  };
}
