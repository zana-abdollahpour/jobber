import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';

import { init } from '@jobber/nestjs';
import { AUTH_PACKAGE_NAME } from '@jobber/grpc';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await init(app);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: require.resolve('@jobber/grpc/auth.proto'),
    },
  });

  await app.startAllMicroservices();
}
void bootstrap();
