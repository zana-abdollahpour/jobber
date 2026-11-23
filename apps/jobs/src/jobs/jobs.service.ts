import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/internal';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';

import { JobMetadataDecorator } from '../decorators/job.decorator';
import { JobMetadata } from '../interfaces/job-metadata.interface';
import { AbstractJob } from '../interfaces/job.abstract';

interface DiscoveredJob {
  wrapper: InstanceWrapper;
  meta: JobMetadata;
}

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredJob[] = [];

  constructor(private readonly discoveryService: DiscoveryService) {}

  async onModuleInit() {
    const wrappers = this.discoveryService.getProviders({
      metadataKey: JobMetadataDecorator.KEY,
    });

    this.jobs = wrappers.map((wrapper) => ({
      wrapper: wrapper,
      meta: this.discoveryService.getMetadataByDecorator(
        JobMetadataDecorator,
        wrapper,
      ) as JobMetadata,
    }));
  }

  async executeJob(name: string) {
    const job = this.jobs.find((job) => job.meta.name === name);

    if (!job) {
      throw new BadRequestException(`Job '${name}' does not exist`);
    }

    await (job.wrapper.instance as AbstractJob).execute();

    return job.meta;
  }

  getJobs() {
    return this.jobs.map((job) => job.meta);
  }
}
