import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../../users/users.module';
import { HashingModule } from '../hashing/hashing.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRATION_MS'),
        },
      }),
    }),
    HashingModule,
    UsersModule,
  ],
  providers: [AuthenticationResolver, AuthenticationService],
})
export class AuthenticationModule {}
