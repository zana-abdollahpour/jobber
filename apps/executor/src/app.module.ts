import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '@jobber/nestjs';

import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule, JobsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
