import { Injectable } from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: {
        email: data.email,
        password: await this.hashingService.hash(data.password),
      },
    });
  }

  async findAll() {
    return this.prismaService.user.findMany({
      select: { id: true, email: true },
    });
  }
}
