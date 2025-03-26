import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnauthorizedError } from '../types/error-types.data';
import { CorrelationIdService } from '../middleware/correlator-id.middleware';
import { AppConfigService } from '../../helper-modules/app-config/app-config.service';

@Injectable()
export class EventEmitterService {
  private readonly timeout: number;
  private readonly logger = new Logger(EventEmitterService.name);
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly correlationIdService: CorrelationIdService,
    private appConfigService: AppConfigService,
  ) {
    this.timeout = this.appConfigService.getPromiseTimeout();
  }

  // Function to fire an event with an explicit correlation ID
  async fireEvent(correlationId: string, message: any): Promise<void> {
    this.logger.log(`fireEvent correlationId ${correlationId}`);
    this.eventEmitter.emit(`${correlationId}`, message);
  }

  // Function to listen to the event with an explicit correlation ID, returning a cleanup function
  onEvent(correlationId: string, callback: (message: any) => void): () => void {
    const listener = (message: any) => callback(message);
    this.eventEmitter.once(`${correlationId}`, listener);

    this.logger.log(`onEvent correlationId ${correlationId}`);
    // Return a cleanup function to remove the listener
    return () => {
      this.eventEmitter.off(`${correlationId}`, listener);
    };
  }

  waitForEvent(): Promise<any> {
    const correlationId = this.correlationIdService.getCorrelationId();

    this.logger.log(`waitForEvent correlationId ${correlationId}`);

    return new Promise((resolve, reject) => {
      const cleanup = this.onEvent(correlationId, (data: any) => {
        cleanup(); // Remove listener once the event is handled
        resolve(data.message);
      });

      setTimeout(() => {
        cleanup(); // Ensure listener is removed on timeout
        reject(new UnauthorizedError('t24 Service Unavailable'));
      }, this.timeout);
    });
  }
}
