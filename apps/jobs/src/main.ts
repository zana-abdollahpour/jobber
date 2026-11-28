import 'module-alias/register';
import { NestFactory } from '@nestjs/core';

import { init } from '@jobber/nestjs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await init(app);
}
void bootstrap();
