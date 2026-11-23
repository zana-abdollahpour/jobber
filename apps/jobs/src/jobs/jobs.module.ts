import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { JobsService } from './jobs.service';
import { FibonacciJob } from './fibonacci.job';

@Module({
  imports: [DiscoveryModule],
  providers: [JobsService, FibonacciJob],
})
export class JobsModule {}
