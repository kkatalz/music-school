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

  // Comma-separated list of allowed origins, e.g. "https://music-school.vercel.app".
  // Unset means same-origin only, which is what the Vite dev proxy and the Vercel
  // rewrite both rely on.
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (allowedOrigins?.length) {
    app.enableCors({ origin: allowedOrigins, credentials: true });
  }

  app.setGlobalPrefix('api');
  // 0.0.0.0 so the process is reachable from outside its container.
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
