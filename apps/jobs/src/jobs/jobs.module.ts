import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { JobsService } from './jobs.service';
import { FibonacciJob } from './fibonacci.job';
import { JobsResolver } from './jobs.resolver';

@Module({
  imports: [DiscoveryModule],
  providers: [JobsResolver, JobsService, FibonacciJob],
})
export class JobsModule {}
