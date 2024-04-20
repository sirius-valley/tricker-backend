import { type WebhookSourceDTO } from '@domains/webhookSource';

export const mockWebhookSourceDTO: WebhookSourceDTO = {
  id: 'webhookSource666',
  providerWebhookId: 'providerWebhookId111',
  secret: 'webhookSecret',
  issueProviderId: 'issueProviderId456',
  createdAt: new Date('2024-03-12T09:00:00Z'),
  updatedAt: new Date('2024-03-12T09:00:00Z'),
  deletedAt: null,
};
