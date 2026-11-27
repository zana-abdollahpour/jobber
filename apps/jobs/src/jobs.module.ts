import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DiscoveryModule } from '@nestjs/core';

import { JobsService } from './jobs.service';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.job';
import { JobsResolver } from './jobs.resolver';
import { PulsarModule } from '@jobber/pulsar';

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.register([
      {
        name: 'auth',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: require.resolve('@jobber/grpc/auth.proto'),
        },
      },
    ]),
  ],
  providers: [JobsResolver, JobsService, FibonacciJob],
})
export class JobsModule {}
