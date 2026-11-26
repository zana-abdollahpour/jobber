import { Consumer, Message } from 'pulsar-client';
import { OnModuleInit } from '@nestjs/common';

import { PulsarClient } from './pulsar.client.js';

export abstract class PulsarConsumer implements OnModuleInit {
  private consumer!: Consumer;

  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly topic: string,
  ) {}

  protected async acknowledge(message: Message) {
    await this.consumer.acknowledge(message);
  }

  protected abstract onMessage(message: Message): Promise<void>;

  async onModuleInit() {
    this.consumer = await this.pulsarClient.createConsumer(
      this.topic,
      this.onMessage.bind(this),
    );
  }
}
