import { IsNotEmpty, IsString } from 'class-validator';

export class WebhookDynamicRouteParam {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export class WebhookSourceDTO {
  id: string;
  providerWebhookId: string | null;
  secret: string | null;
  issueProviderId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

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
