/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AppConfigService } from '../../helper-modules/app-config/app-config.service';
import {
  InternalServerError,
  UnauthorizedError,
} from '../types/error-types.data';
import { CorrelationIdService } from './correlator-id.middleware';

@Injectable()
export class AuthenticateMiddleware implements CanActivate {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly correlationIdService: CorrelationIdService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest<Request>();
      const correlationId = this.correlationIdService.getCorrelationId();

      this.validateAuthorization(req);

      return true;
    } catch (error) {
      this.handleMiddlewareError(error);
    }
  }

  private validateAuthorization(req: Request): void {
    if (!req.headers.authorization) {
      throw new UnauthorizedError('Unauthorized Error');
    }
  }

 
  private handleMiddlewareError(error: Error): void {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError('Authentication failed');
    }
    throw new InternalServerError('Authentication failed');
  }
}
