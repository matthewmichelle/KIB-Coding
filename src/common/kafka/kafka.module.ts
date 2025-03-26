import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka.service.producer';
import { KafkaConsumerService } from './kafka.service.consumer';
import { EventEmitterService } from '../kafka/kafka.service.event-emitter';
import { KafkaTransformersService } from './kafka.sevice.trasformers';
import { AppConfigService } from '../../helper-modules/app-config/app-config.service';
import { CorrelationIdService } from '../middleware/correlator-id.middleware';
import { KafkaFactoryService } from './kafka.factory.service';

@Module({
  providers: [
    KafkaConsumerService,
    KafkaProducerService,
    EventEmitterService,
    KafkaTransformersService,
    AppConfigService,
    CorrelationIdService,
    KafkaFactoryService,
  ],
  exports: [
    KafkaConsumerService,
    KafkaProducerService,
    EventEmitterService,
    KafkaTransformersService,
    AppConfigService,
    CorrelationIdService,
  ],
})
export class KafkaModule {}
