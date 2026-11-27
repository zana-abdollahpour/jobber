import { BadRequestException, OnModuleDestroy, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Producer } from 'pulsar-client';

import { PulsarClient, serialize } from '@jobber/pulsar';

export abstract class AbstractJob<TData extends object>
  implements OnModuleDestroy
{
  private producer: Producer;
  protected abstract messageClass: Type;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async onModuleDestroy() {
    await this.producer.close();
  }

  private async validateData(data: TData) {
    const errors = await validate(plainToInstance(this.messageClass, data));
    if (errors.length) {
      throw new BadRequestException(
        `Job is invalid: ${JSON.stringify(errors)}`,
      );
    }
  }

  public async execute(data: TData, job: string) {
    await this.validateData(data);

    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }

    await this.producer.send({ data: serialize(data) });
  }
}
