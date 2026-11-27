import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/internal';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';

import { JobMetadataDecorator } from './decorators/job.decorator';
import { JobMetadata } from './interfaces/job-metadata.interface';
import { AbstractJob } from './jobs/job.abstract';

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

  async executeJob(name: string, data: object) {
    const job = this.jobs.find((job) => job.meta.name === name);

    if (!job) {
      throw new BadRequestException(`Job '${name}' does not exist`);
    }

    if (!(job.wrapper.instance instanceof AbstractJob)) {
      throw new InternalServerErrorException(
        'Job is not an instance of AbstractJob',
      );
    }

    await job.wrapper.instance.execute(data, job.meta.name);

    return job.meta;
  }

  getJobs() {
    return this.jobs.map((job) => job.meta);
  }
}
