import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as correlator from 'express-correlation-id';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;

    const correlationId = correlator.getId();

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode; // Get the HTTP status code
        this.logger.log(
          `[${method}] ${url} - Status: ${statusCode} - Processed in ${
            (Date.now() - now) / 1000
          }s - correlationId: ${correlationId}`,
        );
      }),
    );
  }
}
