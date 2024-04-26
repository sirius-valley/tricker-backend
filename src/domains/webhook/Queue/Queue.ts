import type { WebhookFullPayload } from '@domains/webhook/dto';

class Queue {
  isProcessing: boolean;
  private readonly queue: WebhookFullPayload[];
  length: number;

  constructor() {
    this.isProcessing = false;
    this.queue = [];
    this.length = this.queue.length;
  }

  async enqueueElement(payload: WebhookFullPayload): Promise<void> {
    this.queue.push(payload);
  }

  async dequeueElement(): Promise<WebhookFullPayload | undefined> {
    return this.queue.shift();
  }
}

export const queue = new Queue();
