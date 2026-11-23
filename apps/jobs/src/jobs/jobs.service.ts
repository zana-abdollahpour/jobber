import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/internal';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { JOB_METADATA_KEY } from '../decorators/job.decorator';
import { JobMetadata } from '../interfaces/job-metadata.interface';

interface DiscoveredJob {
  wrapper: InstanceWrapper;
  meta: JobMetadata;
}

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredJob[] = [];

  constructor(private readonly discoveryService: DiscoveryService) {}

  async onModuleInit() {
    const allProviders = this.discoveryService.getProviders();

    this.jobs = allProviders
      .filter((wrapper) => {
        const { metatype } = wrapper;
        return metatype && Reflect.getMetadata(JOB_METADATA_KEY, metatype);
      })
      .map((wrapper) => ({
        wrapper,
        meta: Reflect.getMetadata(
          JOB_METADATA_KEY,
          wrapper.metatype!,
        ) as JobMetadata,
      }));
  }
}
