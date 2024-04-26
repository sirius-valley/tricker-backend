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

  /**
   * Asynchronously enqueues a payload in the queue.
   * @param payload The payload to enqueue.
   * @returns A Promise that resolves once the payload is enqueued.
   */
  async enqueueElement(payload: WebhookFullPayload): Promise<void> {
    this.queue.push(payload);
  }

  /**
   * Asynchronously dequeues a payload from the queue.
   * @returns A Promise that resolves to the dequeued payload, or undefined if the queue is empty.
   */
  async dequeueElement(): Promise<WebhookFullPayload | undefined> {
    return this.queue.shift();
  }
}

export const queue = new Queue();
