import { type ProviderWebhookRegistrationData, type WebhookSourceDTO } from '@domains/webhookSource';
import { type IssueProviderDTO } from '@domains/issueProvider';
import { type WebhookService, WebhookServiceImpl } from '@domains/webhook/service';
import crypto from 'node:crypto';
import { NotFoundException } from '@utils';
import * as auth from '@utils/auth';
import { eventRepositoryMock, issueProviderRepositoryMock, webhookRegistrationStategyMock, webhookRegistrationStrategyProviderMock, webhookSourceRepositoryMock } from '../../mock';

describe('webhook service tests', () => {
  let webhookService: WebhookService;

  beforeEach(() => {
    jest.resetAllMocks();
    webhookService = new WebhookServiceImpl(webhookSourceRepositoryMock, issueProviderRepositoryMock, webhookRegistrationStrategyProviderMock, eventRepositoryMock);
  });

  describe('createWebhook method', () => {
    const apiKey = 'some-api-key';
    const projectId = 'project-123';
    const providerProjectId = 'provider-project-456';
    const issueProviderId = 'some-id-123';
    const issueProviderName = 'jira';
    const generatedWebhookId = 'abc-123';
    const providerWebhookId = 'provider-webhook-id';
    const secret = 'shhhh';

    it('registers a webhook successfully', async () => {
      // Given
      const issueProvider: IssueProviderDTO = { id: issueProviderId, name: issueProviderName };
      const webhookRegistrationData: ProviderWebhookRegistrationData = { id: providerWebhookId, secret };
      const expectedWebhookSource: WebhookSourceDTO = {
        createdAt: new Date(),
        deletedAt: new Date(),
        updatedAt: new Date(),
        id: generatedWebhookId,
        secret: webhookRegistrationData.secret,
        providerWebhookId: webhookRegistrationData.id,
        issueProviderId: issueProvider.id,
      };

      issueProviderRepositoryMock.getByName.mockResolvedValueOnce(issueProvider);
      webhookRegistrationStrategyProviderMock.getStrategy.mockReturnValueOnce(webhookRegistrationStategyMock);
      webhookRegistrationStategyMock.registerWebhook.mockResolvedValueOnce(webhookRegistrationData);
      webhookSourceRepositoryMock.create.mockResolvedValueOnce(expectedWebhookSource);
      jest.spyOn(crypto, 'randomUUID').mockImplementationOnce(() => generatedWebhookId as `${string}-${string}-${string}-${string}-${string}`);
      jest.spyOn(auth, 'encryptData').mockImplementation(() => secret);

      // When
      const createdWebhook = await webhookService.createWebhook({
        apiKey,
        projectId,
        providerProjectId,
        issueProviderName,
      });

      // Then
      expect(issueProviderRepositoryMock.getByName).toHaveBeenCalledWith(issueProviderName);
      expect(webhookRegistrationStrategyProviderMock.getStrategy).toHaveBeenCalledWith(issueProviderName);
      expect(webhookRegistrationStategyMock.registerWebhook).toHaveBeenCalledWith({
        providerApiKey: apiKey,
        providerProjectId,
        trickerWebhookSourceId: generatedWebhookId,
      });
      expect(webhookSourceRepositoryMock.create).toHaveBeenCalledWith({
        id: generatedWebhookId,
        secret: webhookRegistrationData.secret,
        providerWebhookId: webhookRegistrationData.id,
        issueProviderId: issueProvider.id,
        projectId,
      });
      expect(createdWebhook).toEqual(expectedWebhookSource);
    });

    it('throws NotFoundException when issue provider is not found', async () => {
      // Given
      issueProviderRepositoryMock.getByName.mockResolvedValueOnce(null);

      // When
      try {
        await webhookService.createWebhook({ apiKey, projectId, providerProjectId, issueProviderName });
      } catch (e: any) {
        // Then
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("Not found. Couldn't find Issue Provider");
      }

      // Then
      expect(webhookRegistrationStrategyProviderMock.getStrategy).not.toHaveBeenCalled();
      expect(webhookSourceRepositoryMock.create).not.toHaveBeenCalled();
    });
  });
});
