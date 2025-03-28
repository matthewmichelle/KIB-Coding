import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './helper-modules/app-config/app-config.service';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SerializationInterceptor } from './common/interceptors/serialization-interceptor.filter';
import { PlainLoggerService } from './helper-modules/app-config/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PlainLoggerService(), // Use your custom logger here
  });

  // Replace the default logger with the custom logger

  app.useLogger(app.get(PlainLoggerService));

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new SerializationInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('KIB Codings')
    .setDescription('The microservice responsible for managing movies')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'bearerAuth', // Identifier for the Bearer auth scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Setup Swagger with a custom site title
  SwaggerModule.setup('api-docs', app, document);

  // Get port from AppConfigService
  const appConfigService = app.get(AppConfigService);
  const port = appConfigService.getAppPort();

  await app.listen(port);
  Logger.log(`Application has started on PORT ${port}`);
}

bootstrap();
