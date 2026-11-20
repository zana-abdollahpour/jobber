import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

import { Prisma } from '@/src/generated/prisma';
import { PrismaService } from '@/src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prismaService.user.create({
      data: {
        email: data.email,
        password: await hash(data.password, 12),
      },
    });
  }

  async getUsers() {
    return await this.prismaService.user.findMany();
  }
}
