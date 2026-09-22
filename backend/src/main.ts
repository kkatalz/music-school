import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  app.setGlobalPrefix('api');
  // 0.0.0.0 so the process is reachable from outside its container.
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
