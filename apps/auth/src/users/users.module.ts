import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { HashingModule } from '../iam/hashing/hashing.module';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, HashingModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
