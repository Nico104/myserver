import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // allow Flutter / local dev to access it
  app.enableCors({ origin: true, credentials: true });

  // serve uploaded or synced media files
  app.use('/media', express.static(process.env.MEDIA_ROOT || '/srv/nibbler/media'));

  // listen on all interfaces, port from .env
  await app.listen(Number(process.env.PORT) || 8088, '0.0.0.0');
}
bootstrap();

