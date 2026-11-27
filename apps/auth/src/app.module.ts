import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { GqlContext } from '@jobber/graphql';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { HashingModule } from './iam/hashing/hashing.module';
import { AuthenticationModule } from './iam/authentication/authentication.module';

import { AuthController } from './iam/authentication/authentication.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, res }: GqlContext) => ({ req, res }),
      autoSchemaFile: true,
    }),
    PrismaModule,
    UsersModule,
    HashingModule,
    AuthenticationModule,
  ],
  controllers: [AuthController],
})
export class AppModule {}
