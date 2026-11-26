import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';

import { init } from '@jobber/nestjs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await init(app);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: require.resolve('@jobber/proto/auth.proto'),
    },
  });

  await app.startAllMicroservices();
}
void bootstrap();
