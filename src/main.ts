if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
  // require('dotenv').config();
}

import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnprocessableEntityExceptionFilter } from './exception-handlers/unprocessableEntity-exception.filter';
import { AdminGuard } from './admin/guards/admin.guard';
import { SocketIOAdapter } from './socket-io.adapter';
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //this will transform json object to JS class
    }),
  );

  app.useGlobalFilters(new UnprocessableEntityExceptionFilter());
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new AdminGuard(reflector));
  app.useWebSocketAdapter(new SocketIOAdapter(app));
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
