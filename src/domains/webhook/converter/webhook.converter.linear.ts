import { type WebhookConverter } from '@domains/webhook/converter/webhook.converter';
import { type TrickerEntity, TrickerEntityType, type WebhookFullPayload } from '@domains/webhook/dto';

export class WebhookConverterLinear implements WebhookConverter {
  supports(issueProviderName: string): boolean {
    return issueProviderName === 'LINEAR';
  }

  async processWebhookPayload(input: WebhookFullPayload): Promise<TrickerEntity> {
    return Promise.resolve({ ...input, type: TrickerEntityType.ISSUE });
  }
}
