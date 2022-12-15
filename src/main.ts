if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnprocessableEntityExceptionFilter } from './exception-handlers/unprocessableEntity-exception.filter';
import { AdminGuard } from './admin/guards/admin.guard';

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
  await app.listen(3000);
}
bootstrap();
