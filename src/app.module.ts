import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './helper-modules/app-config/app-config.module';
import { AppConfigService } from './helper-modules/app-config/app-config.service';
import { JwtUtilsModule } from './helper-modules/jwt-utils/jwt-utils.module';
import { DatabaseModule } from './common/database/database.module';
import * as correlator from 'express-correlation-id';
import * as cors from 'cors'; // Importing the cors package
import { BodyParserMiddleware } from './common/middleware/body-parser.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_PIPE } from '@nestjs/core';
import { CustomHeaderMiddleware } from './common/middleware/custom-header.middleware';
import helmet from 'helmet';
import { CorrelationIdService } from './common/middleware/correlator-id.middleware';
import { PlainLoggerService } from './helper-modules/app-config/logger.service';
import { DecryptMiddleware } from './common/middleware/decrypt.middleware';
import { MoviesModule } from './modules/movies/movies.module';
import { RedisService } from './common/database/cache.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    EventEmitterModule.forRoot(),
    AppConfigModule,
    JwtUtilsModule,
    MoviesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    },
    PlainLoggerService,
    CorrelationIdService,
  ],
  exports: [AppConfigModule],
})
export class AppModule implements NestModule {
  constructor(private readonly appConfigService: AppConfigService) {}

  /**
   * Configures middleware for the application.
   *
   * @param {MiddlewareConsumer} consumer - The consumer to which middleware will be applied.
   *
   * This method sets up various middleware for the application, including:
   * - `correlator`: Middleware for generating and managing correlation IDs.
   * - `helmet`: Middleware for securing HTTP headers.
   * - `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS) with a specified origin.
   * - `LoggerMiddleware`: Custom middleware for logging requests.
   * - `BodyParserMiddleware`: Custom middleware for parsing request bodies.
   *
   * The middleware is applied to all routes ('*').
   */
  configure(consumer: MiddlewareConsumer): void {
    const corsUrl = this.appConfigService.getCorsUrl();

    consumer
      .apply(
        correlator(),
        helmet(),
        cors({ origin: corsUrl, optionsSuccessStatus: 200 }),
        LoggerMiddleware,
        BodyParserMiddleware,
        CustomHeaderMiddleware,
      )
      .forRoutes('*');

    consumer
      .apply(DecryptMiddleware)
      .forRoutes({ path: 'login/basic', method: RequestMethod.POST });
  }
}
