import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as correlator from 'express-correlation-id';
import { KafkaProducerService } from '../kafka/kafka.service.producer';
import { EventEmitterService } from '../kafka/kafka.service.event-emitter';
import { KafkaTransformersService } from '../kafka/kafka.sevice.trasformers';
import { AppConfigService } from '../../helper-modules/app-config/app-config.service';
import { RequestInfo } from '../types/request-Info.type';
import { kafkaProducerOptions } from '../types/kafka.type';
import { CompressionTypes } from 'kafkajs';
import {
  InternalServerError,
  UnauthorizedError,
} from '../types/error-types.data';
import { CorrelationIdService } from './correlator-id.middleware';

@Injectable()
export class AuthenticateMiddleware implements CanActivate {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly eventEmitterService: EventEmitterService,
    private readonly KafkaTransformersService: KafkaTransformersService,
    private readonly correlationIdService: CorrelationIdService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest<Request>();
      const correlationId = this.correlationIdService.getCorrelationId();

      this.validateAuthorization(req);

      const requestInfo = this.buildRequestInfo(req, correlationId, {});

      await this.kafkaProducerService.sendKafkaMessage(
        requestInfo,
        correlationId,
        {},
      );

      const result: any = await this.eventEmitterService.waitForEvent();

      const authResult =
        this.KafkaTransformersService.TransformersAuthObject(result);

      if (!authResult) {
        throw new UnauthorizedError('Authentication failed');
      }

      req.user = result.message.data.user;
      req.accessToken = result.message.data.token;
      console.log(' req.user', req.user);

      return authResult;
    } catch (error) {
      this.handleMiddlewareError(error);
    }
  }

  private validateAuthorization(req: Request): void {
    if (!req.headers.authorization) {
      throw new UnauthorizedError('Unauthorized Error');
    }
  }

  private buildRequestInfo(
    req: Request,
    correlationId: string,
    tracingHeaderObj: any,
  ): RequestInfo {
    return {
      topic: this.appConfigService.getKafkaTopics().validateTopic,
      authorization: req.headers.authorization,
      apiRoute: req.originalUrl || '',
      apiMethod: req.method,
      otp: req.body.otp || '',
      correlationId,
      tracingHeader: JSON.stringify(tracingHeaderObj),
    };
  }

  private handleMiddlewareError(error: Error): void {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError('Authentication failed');
    }
    throw new InternalServerError('Authentication failed');
  }
}
