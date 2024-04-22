import type { Request } from 'express';
import { type CustomRequest, webhookSourceRepository } from '@domains/webhook/middleware/webhooksMiddleware';
import { mockWebhookSourceDTO } from '../mockData';
import * as auth from '@utils/auth';
import { Constants, NodeEnv, WebhookValidationException } from '@utils';
import { WebhookLinearMiddleware } from '@domains/webhook/middleware/strategy/webhook.linear.middleware';

const linearMiddleware: WebhookLinearMiddleware = new WebhookLinearMiddleware();

describe('webhook linear middleware', () => {
  const req: Request = {
    headers: {
      'linear-signature': 'someSignature',
    },
    rawBody: Buffer.from('this is a raw body', 'utf-8'),
    route: {
      id: 'someId',
    }, // Property representing the dynamic route parameter for webhooks
    ip: 'wrongIp',
    params: {
      id: 'someId',
    },
  } as unknown as Request as CustomRequest;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('validateWebhookRequest method', () => {
    it('should successfully validate webhook request', async (): Promise<void> => {
      // given
      jest.spyOn(auth, 'decryptData').mockImplementation(() => mockWebhookSourceDTO.secret!);
      jest.spyOn(auth, 'verifyLinearSignature').mockImplementation(() => 'someSignature');

      // when
      const received = await linearMiddleware.validateWebhookRequest(req, mockWebhookSourceDTO);

      // then
      expect.assertions(1);
      expect(received).toEqual('someSignature');
    });

    it('should throw WebhookValidationException when ip is not valid in production environment', async (): Promise<void> => {
      // given - when
      Constants.NODE_ENV = NodeEnv.PROD;
      // then
      expect.assertions(2);
      await expect(linearMiddleware.validateWebhookRequest(req, mockWebhookSourceDTO)).rejects.toThrow(WebhookValidationException);
      await expect(linearMiddleware.validateWebhookRequest(req, mockWebhookSourceDTO)).rejects.toThrow('Webhook request origin IP is not authorized.');
    });

    it('should throw WebhookValidationException when raw body is undefined', async (): Promise<void> => {
      // given - when
      Constants.NODE_ENV = NodeEnv.DEV;
      const req: Request = {
        headers: {
          'linear-signature': 'someSignature',
        },
        route: {
          id: 'someId',
        }, // Property representing the dynamic route parameter for webhooks
        ip: 'wrongIp',
        params: {
          id: 'someId',
        },
      } as unknown as Request as CustomRequest;
      jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue(mockWebhookSourceDTO);
      // then
      expect.assertions(2);
      await expect(linearMiddleware.validateWebhookRequest(req, mockWebhookSourceDTO)).rejects.toThrow(WebhookValidationException);
      await expect(linearMiddleware.validateWebhookRequest(req, mockWebhookSourceDTO)).rejects.toThrow('No signature provided for the webhook payload.');
    });

    it('should throw WebhookValidationException when secret is null', async (): Promise<void> => {
      // given - when - then
      expect.assertions(2);
      await expect(linearMiddleware.validateWebhookRequest(req, { ...mockWebhookSourceDTO, secret: null })).rejects.toThrow(WebhookValidationException);
      await expect(linearMiddleware.validateWebhookRequest(req, { ...mockWebhookSourceDTO, secret: null })).rejects.toThrow('Secret validation problem.');
    });

    it('should throw WebhookValidationException when signature is not correct', async (): Promise<void> => {
      // given - when
      jest.spyOn(auth, 'decryptData').mockImplementation(() => mockWebhookSourceDTO.secret!);
      jest.spyOn(auth, 'verifyLinearSignature').mockImplementation(() => 'wrongSignature');
      // then
      expect.assertions(2);
      await expect(linearMiddleware.validateWebhookRequest(req, mockWebhookSourceDTO)).rejects.toThrow(WebhookValidationException);
      await expect(linearMiddleware.validateWebhookRequest(req, mockWebhookSourceDTO)).rejects.toThrow('Payload signature invalid.');
    });
  });
});
