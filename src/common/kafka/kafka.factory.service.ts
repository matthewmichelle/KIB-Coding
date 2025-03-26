import { Kafka, logLevel } from 'kafkajs';
import { Injectable, Logger } from '@nestjs/common';

import * as fs from 'fs'; // Changed to ES module import for consistency
import { AppConfigService } from '../../helper-modules/app-config/app-config.service';

@Injectable()
export class KafkaFactoryService {
  private readonly logger = new Logger(KafkaFactoryService.name);

  constructor(private appConfigService: AppConfigService) {}

  createKafkaInstance(): Kafka {
    const isEnterprise = this.appConfigService.getKafkaEnterprise() === 'true';
    this.logger.log(
      `Created Kafka instance for ${isEnterprise ? 'Enterprise' : 'Opensource'} edition.`,
    );

    if (isEnterprise) {
      return this.createEnterpriseKafka();
    } else {
      return this.createOpensourceKafka();
    }
  }

  private createEnterpriseKafka(): Kafka {
    return new Kafka({
      logLevel: logLevel.ERROR,
      clientId: this.appConfigService.getkafkaClientId(),
      brokers: this.appConfigService.getKafkaBrokers().split(','),
      ssl: {
        rejectUnauthorized: false,
        key: [fs.readFileSync('client-key.pem', 'utf-8')],
        cert: [fs.readFileSync('client-cert.pem')],
      },
      sasl: {
        mechanism: 'plain',
        username: this.appConfigService.getKafkaEnterpriseUserName(),
        password: this.appConfigService.getKafkaEnterprisePassword(),
      },
      retry: {
        retries: 5,
      },
    });
  }

  private createOpensourceKafka(): Kafka {
    return new Kafka({
      logLevel: logLevel.ERROR,
      clientId: this.appConfigService.getkafkaClientId(),
      brokers: [this.appConfigService.getkafkaBrokerUrl()],
    });
  }
}
