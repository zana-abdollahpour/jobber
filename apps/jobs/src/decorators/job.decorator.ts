import { Injectable, applyDecorators } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { JobMetadata } from '../interfaces/job-metadata.interface';

export const JobMetadataDecorator =
  DiscoveryService.createDecorator<JobMetadata>();

export const Job = (meta: JobMetadata) =>
  applyDecorators(JobMetadataDecorator(meta), Injectable());
