import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as correlator from 'express-correlation-id';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, _: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    const correlationId = correlator.getId();

    this.logger.log(
      `Incoming Request: [${method}] ${originalUrl} - correlationId: ${correlationId}`,
    );

    next();
  }
}
