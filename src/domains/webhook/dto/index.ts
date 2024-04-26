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

export interface TrickerEntity {
  type: TrickerEntityType;
  [key: string]: any;
}

export enum TrickerEntityType {
  ISSUE,
  BLOCKER_STATUS_MODIFICATION,
  ISSUE_CHANGE_LOG,
  PROJECT_STAGE,
  PROJECT_LABEL,
  PRIORITY,
}

export type WebhookStatus = 'PENDING' | 'PROCESSED';
