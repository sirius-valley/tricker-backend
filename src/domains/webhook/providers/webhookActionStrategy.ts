import { type TrickerEntity } from '@domains/webhook/dto';

export interface WebhookActionStrategy {
  perform: (entity: TrickerEntity) => Promise<any>;
}
