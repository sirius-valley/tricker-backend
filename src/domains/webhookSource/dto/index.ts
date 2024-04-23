import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the parameter for dynamic webhook routes.
 */
export class WebhookDynamicRouteParam {
  /** The ID of the webhook. */
  @IsNotEmpty()
  @IsString()
  id!: string;
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
