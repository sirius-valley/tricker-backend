import { type WebhookConverterProvider } from '@domains/webhook/converter';
import { type WebhookActionStrategyProvider } from '@domains/webhook/providers';
import { WebhookActionType, WebhookPayloadType } from '@domains/webhook/dto';
import type { Request } from 'express';
import { NotImplementedException } from '@utils';

export class WebhookProcessor {
  private readonly webhookConverterProvider: WebhookConverterProvider;
  private readonly webhookActionStrategyProvider: WebhookActionStrategyProvider;

  constructor(webhookConverterProvider: WebhookConverterProvider, webhookActionStrategyProvider: WebhookActionStrategyProvider) {
    this.webhookConverterProvider = webhookConverterProvider;
    this.webhookActionStrategyProvider = webhookActionStrategyProvider;
  }

  async process(req: Request, issueProviderName: string): Promise<any> {
    const { eventType, eventAction } = this.prepareWebhookPayload(req, issueProviderName);
    const converter = this.webhookConverterProvider.getWebhookConverter(issueProviderName);
    const entity = converter.convertWebhookPayload({
      eventType,
      webhookBody: req.body,
    });

    const actionPerformer = this.webhookActionStrategyProvider.getStrategy(entity.type, eventAction);
    return await actionPerformer.perform(entity);
  }

  /**
   * Prepares a WebhookPayloadType and a WebhookActionType based on the issue provider name.
   * @param req The incoming request object containing the webhook data.
   * @param issueProviderName The name of the issue provider.
   * @returns The type of the webhook payload.
   */
  private prepareWebhookPayload(req: Request, issueProviderName: string): { eventType: WebhookPayloadType; eventAction: WebhookActionType } {
    let eventType: WebhookPayloadType;
    let eventAction: WebhookActionType;
    switch (issueProviderName) {
      case 'LINEAR': {
        const linearEvent: string = req.headers['linear-event'] as string;
        const linearAction: string = req.body.action as string;
        // we only have two event types for linear, if not IssueLabel, then it's Issue
        if (linearEvent !== 'IssueLabel' && linearEvent !== 'Issue') throw new NotImplementedException();
        eventType = linearEvent === 'IssueLabel' ? WebhookPayloadType.LABEL : WebhookPayloadType.ISSUE;
        // we only have three actions in general, if not create, then it's update, if not update, then it can only be delete
        eventAction = linearAction === 'create' ? WebhookActionType.CREATE : linearAction === 'update' ? WebhookActionType.UPDATE : WebhookActionType.DELETE;
        break;
      }
      default:
        throw new NotImplementedException();
    }

    return { eventType, eventAction };
  }
}
