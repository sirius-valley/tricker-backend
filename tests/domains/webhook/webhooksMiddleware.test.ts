import type { Request, Response } from 'express';
import { issueProviderRepository, validateWebhook, webhookLinearMiddleware, webhookSourceRepository } from '@domains/webhook/middleware/webhooksMiddleware';
import { NotFoundException } from '@utils';
import { mockIssueProviderDTO, mockWebhookSourceDTO } from './mockData';
import { type ExtendedRequest } from '@app';

describe('validateWebhook middleware', () => {
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
  } as unknown as Request as ExtendedRequest;

  const res: Response = {} as unknown as Response;

  const next = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully validate webhook origin and payload', async (): Promise<void> => {
    // given
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue(mockWebhookSourceDTO);
    jest.spyOn(issueProviderRepository, 'getById').mockResolvedValue(mockIssueProviderDTO);
    jest.spyOn(webhookLinearMiddleware, 'validateWebhookRequest').mockResolvedValue('someSignature');

    // when
    await validateWebhook(req, res, next);

    // then
    expect(next).toHaveBeenCalled();
  });

  it('should throw NotFoundException when webhookSource has not been found', async (): Promise<void> => {
    // given - when
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue(null);
    // then
    expect.assertions(1);
    await expect(validateWebhook(req, res, next)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when webhookSource has been logically deleted', async (): Promise<void> => {
    // given - when
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue({ ...mockWebhookSourceDTO, deletedAt: new Date() });
    // then
    expect.assertions(1);
    await expect(validateWebhook(req, res, next)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when issueProvider has not been found', async (): Promise<void> => {
    // given - when
    jest.spyOn(webhookSourceRepository, 'getById').mockResolvedValue(mockWebhookSourceDTO);
    jest.spyOn(issueProviderRepository, 'getById').mockResolvedValue(null);
    // then
    expect.assertions(1);
    await expect(validateWebhook(req, res, next)).rejects.toThrow(NotFoundException);
  });
});
