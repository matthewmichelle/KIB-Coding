import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as correlator from 'express-correlation-id';
import axios, { AxiosError } from 'axios';
import { mapAxiosErrorToHttpException } from './http-exception-mapping.filter';
import { InternalServerError } from '../types/error-types.data';
import * as _ from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException | AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (axios.isAxiosError(exception)) {
      // Map Axios errors to NestJS exceptions
      exception = mapAxiosErrorToHttpException(exception);
      status = exception.getStatus();
    } else {
      // Handle unexpected errors
      exception = new InternalServerError('Unexpected error');
      status = exception.getStatus();
    }

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as {
        message: string | string[];
      };

      const validationMessages = _.isArray(exceptionResponse.message)
        ? exceptionResponse.message
        : [exceptionResponse.message];

      response.status(status).json({
        message: validationMessages,
        stack: exception.stack,
        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      // Handle other exceptions
      response.status(status).json({
        message: exception.message,
        stack: exception.stack,
        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
    const formattedException = JSON.stringify(exception);
    const correlationId = correlator.getId();

    this.logger.error(
      `An error occurred (correlationId: ${correlationId}):\nException Details:\n${formattedException}`,
    );
  }
}
