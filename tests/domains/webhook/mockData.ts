import { type WebhookSourceDTO } from '@domains/webhookSource';
import { type IssueProviderDTO } from '@domains/issueProvider';

export const mockWebhookSourceDTO: WebhookSourceDTO = {
  id: 'webhookSource666',
  providerWebhookId: 'providerWebhookId111',
  secret: 'webhookSecret',
  issueProviderId: 'issueProviderId456',
  createdAt: new Date('2024-03-12T09:00:00Z'),
  updatedAt: new Date('2024-03-12T09:00:00Z'),
  deletedAt: null,
};

export const mockIssueProviderDTO: IssueProviderDTO = {
  name: 'LINEAR',
  id: 'issueProvider978',
};
