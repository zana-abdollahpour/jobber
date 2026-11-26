import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

const GLOBAL_PREFIX = 'api';

export async function init(app: INestApplication) {
  const port = app.get(ConfigService).getOrThrow<number>('PORT');

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());

  await app.listen(port);
  Logger.log(`App is running on http://localhost:${port}/${GLOBAL_PREFIX}`);
}
