import { Injectable } from '@nestjs/common';
import { iterate } from 'fibonacci';

import { PulsarClient, PulsarConsumer } from '@jobber/pulsar';

import { FibonacciData } from './fibonacci-data.interface';

@Injectable()
export class FibonacciConsumer extends PulsarConsumer<FibonacciData> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'Fibonacci');
  }

  protected async onMessage(data: FibonacciData): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
