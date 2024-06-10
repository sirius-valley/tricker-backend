import { WebhookProcessor } from '@domains/webhook/service';
import { webhookActionStrategyMock, webhookActionStrategyProviderMock, webhookConverterMock, webhookConverterProviderMock } from '../../mock';
import { mock } from 'jest-mock-extended';
import { type Request } from 'express';
import { TrickerEntityType, WebhookActionType, WebhookPayloadType } from '@domains/webhook/dto';
import { NotImplementedException } from '@utils';

describe('webhook processor tests', () => {
  let webhookProcessor: WebhookProcessor;

  beforeEach(() => {
    jest.resetAllMocks();
    webhookProcessor = new WebhookProcessor(webhookConverterProviderMock, webhookActionStrategyProviderMock);
  });

  // Successful processing tests
  it('should successfully process a LINEAR Issue create webhook', async () => {
    const requestMock = mock<Request>({
      headers: { 'linear-event': 'Issue' },
      body: { action: 'create' },
    });

    webhookConverterMock.convertWebhookPayload.mockReturnValue({ type: TrickerEntityType.ISSUE });
    webhookConverterProviderMock.getWebhookConverter.mockReturnValue(webhookConverterMock);

    webhookActionStrategyMock.perform.mockResolvedValue('processed');
    webhookActionStrategyProviderMock.getStrategy.mockReturnValue(webhookActionStrategyMock);

    const result = await webhookProcessor.process(requestMock, 'LINEAR');

    expect(result).toBe('processed');
    expect(webhookConverterMock.convertWebhookPayload).toHaveBeenCalledWith({
      eventType: WebhookPayloadType.ISSUE,
      webhookBody: requestMock.body,
    });
    expect(webhookActionStrategyProviderMock.getStrategy).toHaveBeenCalledWith(TrickerEntityType.ISSUE, WebhookActionType.CREATE);
    expect(webhookActionStrategyMock.perform).toHaveBeenCalled();
  });

  it('should successfully process a LINEAR IssueLabel webhook', async () => {
    const requestMock = mock<Request>({
      headers: { 'linear-event': 'IssueLabel' },
      body: { action: 'create' },
    });

    webhookConverterMock.convertWebhookPayload.mockReturnValue({ type: TrickerEntityType.PROJECT_LABEL });
    webhookConverterProviderMock.getWebhookConverter.mockReturnValue(webhookConverterMock);

    webhookActionStrategyMock.perform.mockResolvedValue('processed');
    webhookActionStrategyProviderMock.getStrategy.mockReturnValue(webhookActionStrategyMock);

    const result = await webhookProcessor.process(requestMock, 'LINEAR');

    expect(result).toBe('processed');
    expect(webhookConverterMock.convertWebhookPayload).toHaveBeenCalledWith({
      eventType: WebhookPayloadType.LABEL,
      webhookBody: requestMock.body,
    });
    expect(webhookActionStrategyProviderMock.getStrategy).toHaveBeenCalledWith(TrickerEntityType.PROJECT_LABEL, WebhookActionType.CREATE);
    expect(webhookActionStrategyMock.perform).toHaveBeenCalled();
  });

  // Error handling tests
  it('should throw NotImplementedException for unsupported issue provider', async () => {
    const requestMock = mock<Request>();

    try {
      await webhookProcessor.process(requestMock, 'UNSUPPORTED_PROVIDER');
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotImplementedException);
    }
  });

  it('should throw NotImplementedException for unsupported event type in prepareWebhookPayload', async () => {
    const requestMock = mock<Request>({
      headers: { 'linear-event': 'UNSUPPORTED_EVENT' },
      body: { action: 'create' },
    });

    try {
      await webhookProcessor.process(requestMock, 'LINEAR');
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotImplementedException);
    }
  });
});
