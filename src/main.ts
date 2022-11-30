if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //this will transform json object to JS class
    }),
  );
  await app.listen(3000);
}
bootstrap();
