import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Consumer, Message, Producer } from 'pulsar-client';

@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private readonly APP_SUBSCRIPTION_NAME = 'jobber';
  private readonly logger = new Logger(PulsarClient.name);
  private readonly client: Client;
  private readonly producers: Producer[] = [];
  private readonly consumers: Consumer[] = [];
  private closing = false;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      serviceUrl: this.configService.getOrThrow<string>('PULSAR_SERVICE_URL'),
    });
  }

  async onModuleDestroy() {
    this.closing = true;

    // Snapshot and clear both lists so nothing can mutate them mid-teardown.
    const producers = this.producers.splice(0);
    const consumers = this.consumers.splice(0);

    // Close consumers and producers in parallel — they're independent.
    // Consumers first vs. producers first doesn't matter for correctness here,
    // but closing consumers first stops new work from being picked up while
    // producers finish flushing.
    const [consumerResults, producerResults] = await Promise.all([
      Promise.allSettled(consumers.map((consumer) => consumer.close())),
      Promise.allSettled(producers.map((producer) => producer.close())),
    ]);

    consumerResults.forEach((result, i) => {
      if (result.status === 'rejected') {
        this.logger.error(
          `Failed to close Pulsar consumer #${i}`,
          result.reason,
        );
      }
    });

    producerResults.forEach((result, i) => {
      if (result.status === 'rejected') {
        this.logger.error(
          `Failed to close Pulsar producer #${i}`,
          result.reason,
        );
      }
    });

    // Close the underlying client last, so connections/sockets are released.
    await this.client
      .close()
      .catch((err) => this.logger.error('Failed to close Pulsar client', err));
  }

  async createConsumer(topic: string, listener: (message: Message) => void) {
    if (this.closing) {
      throw new Error('PulsarClient is shutting down; cannot create consumer');
    }

    const consumer = await this.client.subscribe({
      topic,
      listener,
      subscription: this.APP_SUBSCRIPTION_NAME,
    });

    // Guard against a shutdown that raced with createConsumer: if closing
    // flipped while we were awaiting, close the consumer we just made
    // instead of leaking it (and leaving a live subscription behind).
    if (this.closing) {
      await consumer
        .close()
        .catch((err) =>
          this.logger.error(
            'Failed to close consumer created during shutdown',
            err,
          ),
        );
      throw new Error('PulsarClient is shutting down; cannot create consumer');
    }

    this.consumers.push(consumer);
    return consumer;
  }

  async createProducer(topic: string) {
    if (this.closing) {
      throw new Error('PulsarClient is shutting down; cannot create producer');
    }

    const producer = await this.client.createProducer({ topic });

    // Guard against a shutdown that raced with createProducer: if closing flipped
    // while we were awaiting, close the producer we just made instead of leaking it.
    if (this.closing) {
      await producer
        .close()
        .catch((err) =>
          this.logger.error(
            'Failed to close producer created during shutdown',
            err,
          ),
        );
      throw new Error('PulsarClient is shutting down; cannot create producer');
    }

    this.producers.push(producer);
    return producer;
  }
}
