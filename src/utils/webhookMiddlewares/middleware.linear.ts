import type { Request, Response } from 'express';
import crypto from 'crypto';
import { db, decryptData, NotFoundException, WebhookValidationException, Constants } from '@utils';
import { type WebhookDynamicRouteParam, type WebhookSourceDTO } from '@domains/webhookSource/dto';
import { type WebhookSourceRepository } from '@domains/webhookSource/repository/webhookSource.repository';
import { WebhookSourceRepositoryImpl } from '@domains/webhookSource/repository/webhookSource.repository.impl';

/**
 * Represents a custom request object that extends the default Express Request object.
 * Includes optional properties such as rawBody and route for handling webhook requests.
 */
export interface CustomRequest extends Request {
  rawBody?: Buffer; // Optional property for storing the raw body of the request
  route: WebhookDynamicRouteParam; // Property representing the dynamic route parameter for webhooks
}

export const webhookSourceRepository: WebhookSourceRepository = new WebhookSourceRepositoryImpl(db);

/**
 * Middleware function for authenticating webhook requests.
 * Validates the request origin IP, signature, and webhook source.
 * Throws exceptions for invalid requests.
 */
export const linearMiddlewareAuth = async (req: CustomRequest, res: Response, next: () => any): Promise<void> => {
  // Retrieve the dynamic route parameter from the request
  const { id } = req.params;

  // Retrieve the webhook source by its id. We need to split the dynamic route. Example: issue_89b81d0f-fc7e-4bf9-a6a4-39ff771d5c5c
  const webhookSource: WebhookSourceDTO | null = await webhookSourceRepository.getById(id);

  // If webhook source is not found or has been deleted, throw NotFoundException
  if (webhookSource === null || webhookSource.deletedAt !== null) {
    throw new NotFoundException('WebhookSource');
  }

  // Validate the request origin IP if the Production environment is being used
  if (Constants.NODE_ENV === 'production' && (req.ip === undefined || (req.ip !== '35.231.147.226' && req.ip !== '35.243.134.228'))) {
    throw new WebhookValidationException(400, 'Webhook request origin IP is not authorized.');
  }

  // Check if raw body is provided in the request
  if (req.rawBody === undefined) {
    throw new WebhookValidationException(400, 'No signature provided for the webhook payload.');
  }
  // Check if webhook source secret is null
  else if (webhookSource.secret === null) {
    throw new WebhookValidationException(400, 'Secret validation problem.');
  }

  // Decrypt the webhook source secret
  const decryptedSecret: string = decryptData(webhookSource.secret);

  // Verify signature using decrypted secret
  const signature = crypto.createHmac('sha256', decryptedSecret).update(req.rawBody).digest('hex');
  if (signature !== req.headers['linear-signature']) {
    throw new WebhookValidationException(400, 'Payload signature invalid.');
  }

  next();
};
