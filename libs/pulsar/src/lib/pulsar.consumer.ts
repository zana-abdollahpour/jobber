import { Consumer, Message } from 'pulsar-client';
import { Logger, OnModuleInit } from '@nestjs/common';

import { PulsarClient } from './pulsar.client.js';
import { deserialize } from './serialize.js';

export abstract class PulsarConsumer<TData> implements OnModuleInit {
  private consumer!: Consumer;
  protected logger: Logger;

  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly topic: string,
  ) {
    this.logger = new Logger(this.topic);
  }

  async onModuleInit() {
    this.consumer = await this.pulsarClient.createConsumer(
      this.topic,
      this.listener.bind(this),
    );
  }

  protected async acknowledge(message: Message) {
    await this.consumer.acknowledge(message);
  }

  private async listener(message: Message) {
    try {
      const data = deserialize<TData>(message.getData());
      this.logger.debug(`Received message: ${JSON.stringify(data)}`);
      await this.onMessage(data);
    } catch (err) {
      this.logger.error(err);
    } finally {
      await this.acknowledge(message);
    }
  }

  protected abstract onMessage(message: TData): Promise<void>;
}
