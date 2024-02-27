import { type NextFunction, type Request, type Response } from 'express';
import HttpStatus from 'http-status';
import { Logger } from '@utils';

abstract class HttpException extends Error {
  protected constructor(
    readonly code: number,
    readonly message: string,
    readonly error?: object[] | object
  ) {
    super(message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(errorCode?: string) {
    super(HttpStatus.UNAUTHORIZED, `Unauthorized. You must login to access this content.`, { error_code: errorCode });
  }
}

export class ValidationException extends HttpException {
  constructor(errors: object[]) {
    super(HttpStatus.BAD_REQUEST, 'Validation Error', errors);
  }
}

export class NotFoundException extends HttpException {
  constructor(model?: string) {
    super(HttpStatus.NOT_FOUND, `Not found.${model !== null ? " Couldn't find " + model : ''}`);
  }
}

export class ForbiddenException extends HttpException {
  constructor() {
    super(HttpStatus.FORBIDDEN, 'Forbidden. You are not allowed to perform this action');
  }
}

export class ConflictException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.CONFLICT, `Conflict. ${message !== null ? message : ''}`);
  }
}

/**
 * Represents a generic exception for various errors that may occur in the server.
 * Extends the HttpException class.
 */
export class InternalServerErrorException extends HttpException {
  /**
   * Creates an instance of InternalServerErrorException.
   * @param message Optional. A human-readable description of the error.
   * @param errors Optional. Additional details or errors associated with the exception.
   */
  constructor(message?: string, errors?: object | object[]) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message ?? 'Internal Server Error', errors);
  }
}

/**
 * Represents an exception specific to Linear errors.
 * Extends the InternalServerErrorException class.
 */
export class LinearIntegrationException extends InternalServerErrorException {
  /**
   * Creates an instance of LinearIntegrationException.
   * @param message Optional. A human-readable description of the error.
   * @param errors Optional. Additional details or errors associated with the exception.
   */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(message?: string, errors?: object | object[]) {
    super(message, errors);
  }
}

export function ErrorHandling(error: Error, req: Request, res: Response, next: NextFunction): Response {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!error) next(error);
  if (error instanceof HttpException) {
    if (error.code === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(error.message);
    }
    return res.status(error.code).json({ message: error.message, code: error.code, errors: error.error });
  }
  Logger.error(error?.message);
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, code: 500 });
}
