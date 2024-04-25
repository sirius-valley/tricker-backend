import type { NextFunction, RequestHandler, Response } from 'express';
import { db, NotFoundException } from '@utils';
import { type WebhookSourceDTO } from '@domains/webhookSource/dto';
import { type WebhookSourceRepository } from '@domains/webhookSource/repository/webhookSource.repository';
import { WebhookSourceRepositoryImpl } from '@domains/webhookSource/repository/webhookSource.repository.impl';
import { type WebhookMiddleware } from '@domains/webhook/middleware/strategy/webhook.middleware';
import { WebhookLinearMiddleware } from '@domains/webhook/middleware/strategy/webhook.linear.middleware';
import { type IssueProviderDTO, type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider';
import { type ExtendedRequest } from '@app';

export const webhookSourceRepository: WebhookSourceRepository = new WebhookSourceRepositoryImpl(db);
export const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);
export const webhookLinearMiddleware: WebhookMiddleware = new WebhookLinearMiddleware();
const webhookMiddlewareRegistry: Record<string, WebhookMiddleware> = {};

function registerWebhookMiddleware(provider: string, middleware: WebhookMiddleware): void {
  webhookMiddlewareRegistry[provider] = middleware;
}

registerWebhookMiddleware('LINEAR', webhookLinearMiddleware);

/**
 * Middleware function for authenticating webhook requests.
 * Validates the request origin IP, signature, and webhook source.
 * Throws exceptions for invalid requests.
 */
export const validateWebhook: RequestHandler = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  // Retrieve the dynamic route parameter from the request
  const { webhookId } = req.params;

  // Retrieve the webhook source by its id
  const webhookSource: WebhookSourceDTO | null = await webhookSourceRepository.getById(webhookId);

  // If webhook source is not found or has been deleted, throw NotFoundException
  if (webhookSource === null || webhookSource.deletedAt !== null) {
    throw new NotFoundException('WebhookSource');
  }

  // Retrieve the issue provider by its id
  const issueProvider: IssueProviderDTO | null = await issueProviderRepository.getById(webhookSource.issueProviderId);

  // If webhook source is not found, throw NotFoundException
  if (issueProvider === null) {
    throw new NotFoundException('IssueProvider');
  }

  const middleware: WebhookMiddleware = webhookMiddlewareRegistry[issueProvider.name];
  await middleware.validateWebhookRequest(req, webhookSource);

  next();
};
