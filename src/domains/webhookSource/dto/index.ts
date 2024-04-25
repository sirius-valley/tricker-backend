import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the parameter for dynamic webhook routes.
 */
export class WebhookDynamicRouteParam {
  /** The ID of the webhook. */
  @IsNotEmpty()
  @IsString()
  webhookId!: string;
}

/**
 * Data Transfer Object (DTO) for Webhook Source entities.
 * It encapsulates the data related to a webhook source.
 */
export class WebhookSourceDTO {
  /** The ID of the webhook source. */
  id: string;

  /** The ID of the provider webhook. */
  providerWebhookId: string | null;

  /** The secret associated with the webhook source. */
  secret: string | null;

  /** The ID of the issue provider. */
  issueProviderId: string;

  /** The date and time when the webhook source was created. */
  createdAt: Date;

  /** The date and time when the webhook source was last updated. */
  updatedAt: Date;

  /** The date and time when the webhook source was deleted, if applicable. */
  deletedAt: Date | null;

  /**
   * Initializes a new instance of the WebhookSourceDTO class.
   * @param source The source object from which to initialize the DTO.
   */
  constructor(source: WebhookSourceDTO) {
    this.id = source.id;
    this.providerWebhookId = source.providerWebhookId;
    this.secret = source.secret;
    this.issueProviderId = source.issueProviderId;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
    this.deletedAt = source.deletedAt;
  }
}

/**
 * Interface representing the data returned by an issue provider after registering a webhook.
 */
export interface ProviderWebhookRegistrationData {
  /**
   * The secret associated with the registered webhook.
   */
  secret: string;

  /**
   * The unique identifier of the registered webhook within the issue provider platform.
   */
  id: string;
}

/**
 * Interface representing the data required to create a new webhook source in the database.
 */
export interface WebhookSourceCreateInput {
  /**
   * The unique identifier of the webhook source.
   */
  id: string;

  /**
   * The encrypted secret associated with the webhook source.
   */
  secret: string;

  /**
   * The ID of the webhook within the issue provider system.
   */
  providerWebhookId: string;

  /**
   * The ID of the associated issue provider.
   */
  issueProviderId: string;

  /**
   * The ID of the project associated with the webhook.
   */
  projectId: string;
}
