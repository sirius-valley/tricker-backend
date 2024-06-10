import { type JsonObject } from '@utils';

/**
 * Interface representing the full payload of a webhook event.
 */
export interface WebhookFullPayload {
  /** Type of event associated with the webhook payload. */
  eventType: WebhookPayloadType;
  /** Body of the webhook payload. */
  webhookBody: JsonObject;
}

/**
 * Enum representing the types of payloads associated with webhooks.
 */
export enum WebhookPayloadType {
  LABEL,
  ISSUE,
}

export enum WebhookActionType {
  CREATE,
  UPDATE,
  DELETE,
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
export type WebhookStatus = 'PENDING' | 'PROCESSED' | 'ERROR';
