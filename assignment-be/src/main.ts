import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { VercelRequest, VercelResponse } from '@vercel/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Assginment API')
    .setDescription('This is the Assginment API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  // CORS setup
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Initialize app without listening (serverless environment)
  await app.init();
}

// Vercel serverless function handler
export default async (req: VercelRequest, res: VercelResponse) => {
  await bootstrap();
  res.status(200).send('Hello from NestJS on Vercel!');
};
