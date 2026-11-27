import { PulsarClient } from '@jobber/pulsar';

import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../job.abstract';
import { FibonacciData } from './fibonacci-data.message';
import { Type } from '@nestjs/common';

@Job({
  name: 'Fibonacci',
  description: 'Generates a Fibonacci sequence and stores it in the database',
})
export class FibonacciJob extends AbstractJob<FibonacciData> {
  protected messageClass = FibonacciData;

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }

  public async execute() {
    console.log("I'm running Fibonacci and happy for it");
  }
}
