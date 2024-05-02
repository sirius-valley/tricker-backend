import { Router, type Request, type Response } from 'express';
import HttpStatus from 'http-status';
import { db, Logger, validateRequest } from '@utils';
import { WebhookDynamicRouteParam, type WebhookSourceRepository, WebhookSourceRepositoryImpl } from '@domains/webhookSource';
import { validateWebhook } from '@domains/webhook/middleware/webhooksMiddleware';
import { type WebhookConverterProvider, WebhookConverterProviderImpl } from '@domains/webhook/converter';
import { type WebhookActionStrategyProvider, WebhookActionStrategyProviderImpl } from '@domains/webhook/providers';
import { type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider';
import { WebhookRegistrationStrategyProvider, type WebhookService, WebhookServiceImpl } from '@domains/webhook/service';
import { type EventRepository, EventRepositoryImpl } from '@domains/event';

export const webhookRouter = Router();

const webhookConverterProvider: WebhookConverterProvider = new WebhookConverterProviderImpl();
const webhookActionStrategyProvider: WebhookActionStrategyProvider = new WebhookActionStrategyProviderImpl();
const webhookSourceRepository: WebhookSourceRepository = new WebhookSourceRepositoryImpl(db);
const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);
const strategyProvider: WebhookRegistrationStrategyProvider = new WebhookRegistrationStrategyProvider();
const eventRepository: EventRepository = new EventRepositoryImpl(db);
const webhookService: WebhookService = new WebhookServiceImpl(webhookSourceRepository, issueProviderRepository, strategyProvider, eventRepository, webhookConverterProvider, webhookActionStrategyProvider);

webhookRouter.post('/:webhookId', validateRequest(WebhookDynamicRouteParam, 'params'), validateWebhook, async (req: Request, res: Response) => {
  try {
    await webhookService.handleWebhookArrival(req);
  } catch (e: any) {
    Logger.error(e);
  }
  return res.sendStatus(HttpStatus.OK);
});
