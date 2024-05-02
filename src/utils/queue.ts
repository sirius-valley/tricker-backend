import Queue from 'queue';
import { Logger } from '@utils/logger';

export const webhooksQueue = new Queue({ autostart: true });

webhooksQueue.addListener('success', () => {
  Logger.success('Webhook event processing finished successfully!');
});

webhooksQueue.addListener('error', (e) => {
  Logger.error('Webhook event processing error!');
  Logger.error(e);
});

webhooksQueue.addListener('end', () => {
  Logger.success('Webhook queue finished!');
});
