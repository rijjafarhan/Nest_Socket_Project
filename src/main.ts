import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true //dont allow the elements not defined in dto to be passed in the req
  }))
  await app.listen(process.env.PORT ?? 30001);
}
bootstrap();
