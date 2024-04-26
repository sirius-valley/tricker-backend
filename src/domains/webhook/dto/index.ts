import { type IssueProviderDTO } from '@domains/issueProvider';

/**
 * Interface representing the full payload of a webhook event.
 */
export interface WebhookFullPayload {
  /** Unique identifier of the webhook. */
  webhookId: string;
  /** Type of event associated with the webhook payload. */
  eventType: WebhookPayloadType;
  /** Body of the webhook payload. */
  webhookBody: JSON;
}

/**
 * Data Transfer Object (DTO) representing a confirmation response from a webhook.
 */
export class WebhookConfirmationDTO {
  /** Type of event associated with the confirmation. */
  eventType: WebhookPayloadType;
  /** Provider information related to the issue. */
  issueProvider: IssueProviderDTO;

  /**
   * Constructs a new WebhookConfirmationDTO object.
   * @param confirmation An object containing confirmation data.
   */
  constructor(confirmation: WebhookConfirmationDTO) {
    this.eventType = confirmation.eventType;
    this.issueProvider = confirmation.issueProvider;
  }
}

/**
 * Enum representing the types of payloads associated with webhooks.
 */
export enum WebhookPayloadType {
  LABEL,
  ISSUE,
}

/**
 * Interface representing a generic trigger entity.
 */
export interface TrickerEntity {
  /** Type of the trigger entity. */
  type: TrickerEntityType;
  /** Additional properties associated with the trigger entity. */
  [key: string]: any;
}

/**
 * Enum representing the types of trigger entities.
 */
export enum TrickerEntityType {
  ISSUE,
  BLOCKER_STATUS_MODIFICATION,
  ISSUE_CHANGE_LOG,
  PROJECT_STAGE,
  PROJECT_LABEL,
  PRIORITY,
}

/** Type representing the status of a webhook. */
export type WebhookStatus = 'PENDING' | 'PROCESSED';
