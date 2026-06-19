import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enforce global validation pipe for all incoming requests
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS to allow the frontend to make requests to the backend
  app.enableCors({
    origin: 'http://localhost:5173',
    // Allow cookies and headers to be sent with requests
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
