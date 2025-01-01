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

  // In a serverless environment (Vercel), we don't use app.listen(). Instead, we initialize the app.
  if (process.env.VERCEL === '1') {
    // If running in Vercel, don't use app.listen    
    await app.init();
  } else {
    // If running locally, use app.listen to start the server.
    await app.listen(4000);
    console.log('NestJS app is running on http://localhost:4000');
  }
}

// Vercel serverless function handler
export default async (req: VercelRequest, res: VercelResponse) => {
  await bootstrap();
  res.status(200).send('Hello from NestJS on Vercel!');
};
