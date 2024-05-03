import { type ProviderWebhookRegistrationData, type WebhookSourceDTO } from '@domains/webhookSource';
import { type IssueProviderDTO } from '@domains/issueProvider';
import { type WebhookService, WebhookServiceImpl } from '@domains/webhook/service';
import crypto from 'node:crypto';
import { NotFoundException, NotImplementedException } from '@utils';
import * as auth from '@utils/auth';
import { eventRepositoryMock, issueProviderRepositoryMock, webhookProcessorMock, webhookRegistrationStategyMock, webhookRegistrationStrategyProviderMock, webhookSourceRepositoryMock } from '../../mock';
import { mock } from 'jest-mock-extended';
import { type Request } from 'express';
import { type LogWebhooksDTO } from '@domains/event';

describe('webhook service tests', () => {
  let webhookService: WebhookService;

  beforeEach(() => {
    jest.resetAllMocks();
    webhookService = new WebhookServiceImpl(webhookSourceRepositoryMock, issueProviderRepositoryMock, webhookRegistrationStrategyProviderMock, eventRepositoryMock, webhookProcessorMock);
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

  describe('handleWebhookArrival method', () => {
    it('should throw NotFoundException if webhook source is not found', async () => {
      // Given
      const req = mock<Request>({
        params: { webhookId: 'unknown-id' },
      });
      webhookSourceRepositoryMock.getById.mockResolvedValueOnce(null);

      // When
      try {
        await webhookService.handleWebhookArrival(req);
        fail('Expected NotFoundException');
      } catch (e: any) {
        // Then
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("Not found. Couldn't find WebhookSource");
      }
    });

    // if issue provider is not found
    it('should throw NotFoundException if issue provider is not found', async () => {
      // Given
      const req = mock<Request>({
        params: { webhookId: 'valid-id' },
      });
      const mockWebhookSource = mock<WebhookSourceDTO>({
        id: 'valid-id',
        deletedAt: null,
      });
      webhookSourceRepositoryMock.getById.mockResolvedValueOnce(mockWebhookSource);
      issueProviderRepositoryMock.getById.mockResolvedValueOnce(null);

      // When
      try {
        await webhookService.handleWebhookArrival(req);
        fail('Expected NotFoundException');
      } catch (e: any) {
        // Then
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("Not found. Couldn't find Issue Provider");
      }
    });

    // if no converter is available for the specified issue provider
    it('should throw NotImplementedException if no converter is available for the issue provider', async () => {
      // Given
      const req = mock<Request>();
      req.params = { webhookId: 'valid-id' };
      // const webhookSource = { id: 'source-id', issueProviderId: 'unknown-provider' };
      const issueProvider = { id: 'provider-id', name: 'unknown-provider' };
      // webhookSourceRepositoryMock.getById.mockResolvedValueOnce(webhookSource);
      issueProviderRepositoryMock.getById.mockResolvedValueOnce(issueProvider);
      // webhookConverterProviderMock.getWebhookConverter.mockThrows(new NotImplementedException());

      // When
      try {
        await webhookService.handleWebhookArrival(req);
        fail('Expected NotImplementedException');
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(NotImplementedException);
      }
    });

    // if no action is found for the entity type nor the action type
    it('should ', () => {});

    // if issue provider name is not found when preparing webhook payload
    it('should throw an error if issue provider name is not found when preparing webhook payload', async () => {
      // Given
      const req = mock<Request>({
        params: { webhookId: 'valid-id' },
      });
      const mockWebhookSource = mock<WebhookSourceDTO>({
        id: 'valid-id',
        deletedAt: null,
      });
      const issueProviderMock = mock<IssueProviderDTO>({
        name: 'fake',
      });
      const createdWebhookMock = mock<LogWebhooksDTO>();
      const updatedLogWebhookMock = mock<LogWebhooksDTO>({ ...createdWebhookMock });
      webhookSourceRepositoryMock.getById.mockResolvedValueOnce(mockWebhookSource);
      issueProviderRepositoryMock.getById.mockResolvedValueOnce(issueProviderMock); // No issue provider for the source
      eventRepositoryMock.createLogWebhook.mockResolvedValueOnce(createdWebhookMock);
      eventRepositoryMock.updateLogWebhook.mockResolvedValueOnce(updatedLogWebhookMock);

      // When
      try {
        await webhookService.handleWebhookArrival(req);
        fail('Expected NotImplementedException');
      } catch (e: any) {
        // Then
        expect(e).toBeInstanceOf(NotImplementedException);
      }
    });
  });
});
