import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove any properties from DTOs that are not defined in the class
    forbidNonWhitelisted: true, // Throws an error if any undefined properties are found
    transform: true // Automatically transform incoming data to the expected types
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
