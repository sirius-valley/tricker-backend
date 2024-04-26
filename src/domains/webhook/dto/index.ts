import { type IssueProviderDTO } from '@domains/issueProvider';

export interface WebhookFullPayload {
  webhookId: string;
  eventType: WebhookPayloadType;
  webhookBody: JSON;
}

export class WebhookConfirmationDTO {
  eventType: WebhookPayloadType;
  issueProvider: IssueProviderDTO;

  constructor(confirmation: WebhookConfirmationDTO) {
    this.eventType = confirmation.eventType;
    this.issueProvider = confirmation.issueProvider;
  }
}

export enum WebhookPayloadType {
  LABEL,
  ISSUE,
}
