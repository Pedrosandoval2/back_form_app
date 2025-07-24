import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: 'http://localhost:3000', // solo permite ese origen
    origin: '*', // opción menos segura: permite todos los orígenes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // Quita campos no definidos en el DTO
    // forbidNonWhitelisted: true,  // Lanza error si hay campos no definidos
    transform: true,              // Convierte el JSON plano a instancia del DTO
  }));

  await app.listen(3001);
}
bootstrap();
