import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (dev and production)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
  });

  // Set global prefix for all routes, but exclude the root health check
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.HEAD },
    ],
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Register global exception filter with Winston
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('YoyImmo API')
    .setDescription('Property management API for YoyImmo application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
