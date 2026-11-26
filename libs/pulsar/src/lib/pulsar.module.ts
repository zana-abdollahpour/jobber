import { Module } from '@nestjs/common';
import { PulsarClient } from './pulsar.client.js';

@Module({
  providers: [PulsarClient],
  exports: [PulsarClient],
})
export class PulsarModule {}
