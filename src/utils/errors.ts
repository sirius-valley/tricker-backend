import { type NextFunction, type Request, type Response } from 'express';
import HttpStatus from 'http-status';
import { type JsonObject, Logger } from '@utils';
import type { WebhookSourceDTO } from '@domains/webhookSource';

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
  constructor(errorCode?: string, message?: string) {
    super(HttpStatus.UNAUTHORIZED, message ?? `Unauthorized. You must login to access this content.`, { error_code: errorCode });
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
 * Extends the HttpException class.
 */
export class LinearIntegrationException extends HttpException {
  constructor(code: number, message?: string, error?: object[] | object) {
    super(code, message ?? 'Linear error.', error);
  }
}

/**
 * Represents an exception specific to a Webhook validation request.
 * Extends the HttpException class.
 */
export class WebhookValidationException extends HttpException {
  constructor(code: number, message?: string, error?: object[] | object) {
    super(code, message ?? 'Webhook source invalid.', error);
  }
}

/**
 * An exception class thrown when a requested feature or functionality is not implemented.
 *
 * @extends HttpException
 */
export class NotImplementedException extends HttpException {
  /**
   * Creates a new `NotImplementedException` instance.
   *
   * @param {string} [message] - An optional additional message to provide more context.
   */
  constructor(message?: string) {
    super(HttpStatus.NOT_IMPLEMENTED, `Not implemented. ${message}`);
  }
}

/**
 * An exception class thrown when an error occurs during webhook processing.
 *
 * @extends Error
 */
export class WebhooksProcessingException extends Error {
  /**
   * The source of the webhook that is associated with the error.
   *
   * @type {WebhookSourceDTO}
   */
  webhookSource: WebhookSourceDTO;

  /**
   * The payload data associated with the webhook that failed processing.
   *
   * @type {JsonObject}
   */
  payload: JsonObject;

  /**
   * The specific reason why the webhook processing failed.
   *
   * @type {string}
   */
  reason: string;

  /**
   * @param {WebhookSourceDTO} webhookSource - The source of the problematic webhook.
   * @param {JsonObject} payload - The payload data associated with the webhook.
   * @param {string} reason - The reason for the processing failure.
   */
  constructor(webhookSource: WebhookSourceDTO, payload: JsonObject, reason: string) {
    super('An error occured while processing webhook!');
    this.payload = payload;
    this.webhookSource = webhookSource;
    this.reason = reason;
  }
}

export function ErrorHandling(error: Error, req: Request, res: Response, next: NextFunction): Response {
  if (error === null || error === undefined) next(error);
  if (error instanceof HttpException) {
    if (error.code === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.fatal(error);
    }

    if (error.code === HttpStatus.BAD_REQUEST) {
      Logger.fatal(error);
      Logger.debug(JSON.stringify(error.error));
    }

    return res.status(error.code).json({ message: error.message, code: error.code, errors: error.error });
  }
  Logger.fatal(error);
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, code: 500 });
}
