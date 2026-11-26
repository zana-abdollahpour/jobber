import { OnModuleDestroy } from '@nestjs/common';
import { Producer } from 'pulsar-client';

import { PulsarClient } from '@jobber/pulsar';

export abstract class AbstractJob<TData extends object>
  implements OnModuleDestroy
{
  private producer: Producer;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async onModuleDestroy() {
    await this.producer.close();
  }

  public async execute(data: TData, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }
    await this.producer.send({ data: Buffer.from(JSON.stringify(data)) });
  }
}
