import { Global, Injectable } from '@nestjs/common';
import * as correlator from 'express-correlation-id';

@Injectable()
@Global()
export class CorrelationIdService {
  getCorrelationId(): string | undefined {
    return correlator.getId();
  }
}
