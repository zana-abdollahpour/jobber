import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DiscoveryModule } from '@nestjs/core';

import { JobsService } from './jobs.service';
import { FibonacciJob } from './fibonacci.job';
import { JobsResolver } from './jobs.resolver';

@Module({
  imports: [
    DiscoveryModule,
    ClientsModule.register([
      {
        name: 'auth',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: require.resolve('@jobber/proto/auth.proto'),
        },
      },
    ]),
  ],
  providers: [JobsResolver, JobsService, FibonacciJob],
})
export class JobsModule {}
