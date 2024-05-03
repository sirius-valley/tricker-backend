import { type WebhookActionStrategy } from '@domains/webhook/service/action/webhookAction.strategy';
import { type TrickerEntity, TrickerEntityType } from '../../dto';
import { Logger } from '@utils';

export class LoggerExampleStrategy implements WebhookActionStrategy {
  async perform(entity: TrickerEntity): Promise<any> {
    // to be changed when working in actual convertion in next ticket
    // this class will be deleted and replaced with a suitable one
    Logger.success(`Webhook action performed for ${TrickerEntityType[entity.type]}`);
    return entity;
  }
}
