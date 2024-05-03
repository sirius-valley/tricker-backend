import { Router, type Request, type Response } from 'express';
import HttpStatus from 'http-status';
import { db, Logger, validateRequest } from '@utils';
import { WebhookDynamicRouteParam, type WebhookSourceRepository, WebhookSourceRepositoryImpl } from '@domains/webhookSource';
import { validateWebhook } from '@domains/webhook/middleware/webhooksMiddleware';
import { type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider';
import { webhookActionStrategyProviderImplInstance, WebhookRegistrationStrategyProvider, type WebhookService, WebhookServiceImpl, webhookConverterProviderImplInstance } from '@domains/webhook/service';
import { type EventRepository, EventRepositoryImpl } from '@domains/event';
import { WebhookProcessor } from '@domains/webhook/service/processor/webhook.processor';

export const webhookRouter = Router();

const webhookProcessor: WebhookProcessor = new WebhookProcessor(webhookConverterProviderImplInstance, webhookActionStrategyProviderImplInstance);
const webhookSourceRepository: WebhookSourceRepository = new WebhookSourceRepositoryImpl(db);
const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);
const strategyProvider: WebhookRegistrationStrategyProvider = new WebhookRegistrationStrategyProvider();
const eventRepository: EventRepository = new EventRepositoryImpl(db);
const webhookService: WebhookService = new WebhookServiceImpl(webhookSourceRepository, issueProviderRepository, strategyProvider, eventRepository, webhookProcessor);

webhookRouter.post('/:webhookId', validateRequest(WebhookDynamicRouteParam, 'params'), validateWebhook, async (req: Request, res: Response) => {
  try {
    await webhookService.handleWebhookArrival(req);
  } catch (e: any) {
    Logger.error(e);
  }
  return res.sendStatus(HttpStatus.OK);
});
