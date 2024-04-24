import { Router, type Request, type Response } from 'express';
import HttpStatus from 'http-status';
import { validateWebhook } from '@domains/webhook/middleware/webhooksMiddleware';
import { Logger, validateRequest } from '@utils';
import { WebhookDynamicRouteParam } from '@domains/webhookSource';

export const webhookRouter = Router();

webhookRouter.use('/:webhookId', validateRequest(WebhookDynamicRouteParam, 'params'), validateWebhook, (req: Request, res: Response) => {
  // just for testing, will be replaced with actual processing
  Logger.success({ prefix: 'webhooks', message: 'Params' });
  console.log(JSON.stringify(req.params));
  Logger.success({ prefix: 'webhooks', message: 'Headers' });
  console.log(JSON.stringify(req.headers));
  Logger.success({ prefix: 'webhooks', message: 'Query' });
  console.log(JSON.stringify(req.query));
  Logger.success({ prefix: 'webhooks', message: 'Body' });
  console.log(JSON.stringify(req.body));

  return res.sendStatus(HttpStatus.OK);
});
