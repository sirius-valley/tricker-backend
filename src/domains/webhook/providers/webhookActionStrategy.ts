import { type TrickerEntity } from '@domains/webhook/dto';

export interface WebhookActionStrategy {
  /**
   * Performs the webhook action for the given entity.
   *
   * @param {TrickerEntity} entity - The entity involved in the webhook action.
   * @returns {Promise<any>} A promise that resolves to the entity.
   */
  perform: (entity: TrickerEntity) => Promise<any>;
}
