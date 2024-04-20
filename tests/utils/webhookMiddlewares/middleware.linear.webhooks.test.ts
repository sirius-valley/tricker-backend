import type { Request, Response } from 'express';
import { validateLinearWebhook, webhookSourceRepository } from '@utils/webhookMiddlewares/middleware.linear.webhooks';
import { type CustomRequest } from '@utils/webhookMiddlewares';
import { mockWebhookSourceDTO } from './mockData';
import * as auth from '@utils/auth';
import { Constants, NodeEnv, NotFoundException, WebhookValidationException } from '@utils';

describe('validateUserIsProjectManager middleware', () => {
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

  const res: Response = {} as unknown as Response;

  const next = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully validate webhook origin and payload', async (): Promise<void> => {
    // given
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue(mockWebhookSourceDTO);
    jest.spyOn(auth, 'decryptData').mockImplementation(() => mockWebhookSourceDTO.secret!);
    jest.spyOn(auth, 'verifyLinearSignature').mockImplementation(() => 'someSignature');

    // when
    await validateLinearWebhook(req, res, next);

    // then
    expect(next).toHaveBeenCalled();
  });

  it('should throw NotFoundException when webhookSource has not been found', async (): Promise<void> => {
    // given - when
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue(null);
    // then
    expect.assertions(1);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when webhookSource has been logically deleted', async (): Promise<void> => {
    // given - when
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue({ ...mockWebhookSourceDTO, deletedAt: new Date() });
    // then
    expect.assertions(1);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow(NotFoundException);
  });

  it('should throw WebhookValidationException when ip is not valid in production environment', async (): Promise<void> => {
    // given - when
    Constants.NODE_ENV = NodeEnv.PROD;
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue(mockWebhookSourceDTO);
    // then
    expect.assertions(2);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow(WebhookValidationException);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow('Webhook request origin IP is not authorized.');
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
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow(WebhookValidationException);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow('No signature provided for the webhook payload.');
  });

  it('should throw WebhookValidationException when secret is null', async (): Promise<void> => {
    // given - when
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue({ ...mockWebhookSourceDTO, secret: null });
    // then
    expect.assertions(2);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow(WebhookValidationException);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow('Secret validation problem.');
  });

  it('should throw WebhookValidationException when signature is not correct', async (): Promise<void> => {
    // given - when
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue(mockWebhookSourceDTO);
    jest.spyOn(auth, 'decryptData').mockImplementation(() => mockWebhookSourceDTO.secret!);
    jest.spyOn(auth, 'verifyLinearSignature').mockImplementation(() => 'wrongSignature');
    // then
    expect.assertions(2);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow(WebhookValidationException);
    await expect(validateLinearWebhook(req, res, next)).rejects.toThrow('Payload signature invalid.');
  });
});
