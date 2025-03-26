import { Injectable, Logger } from '@nestjs/common';
import { Admin, CompressionTypes, Producer, RecordMetadata } from 'kafkajs';
import { kafkaProducerOptions } from '../types/kafka.type';
import { AppConfigService } from '../../helper-modules/app-config/app-config.service';
import { KafkaFactoryService } from './kafka.factory.service';
import { KafkaConsumerService } from './kafka.service.consumer';
import { RequestInfo } from '../../common/types/request-Info.type';

/**
 * Service for producing messages to Kafka topics.
 */
@Injectable()
export class KafkaProducerService {
  private producer: Producer;
  private readonly logger = new Logger(KafkaProducerService.name);
  private idpResponse: string;
  private validateTopic: string;
  private kafkaPartitionNumber: number;

  constructor(
    private appConfigService: AppConfigService,
    private readonly kafkaFactoryService: KafkaFactoryService,
    private readonly kafkaConsumerService: KafkaConsumerService,
  ) {
    this.idpResponse = this.appConfigService.getKafkaTopics().idpResponse;
    this.validateTopic = this.appConfigService.getKafkaTopics().validateTopic;
    this.kafkaPartitionNumber = this.appConfigService.getkafkaPartitionNumber();
  }

  /**
   * Initializes the Kafka producer connection.
   */
  async onModuleInit(): Promise<void> {
    try {
      const kafka = this.kafkaFactoryService.createKafkaInstance();

      this.producer = kafka.producer(
        this.appConfigService.getkafkaProducerPolicy(),
      );
      const admin = kafka.admin();
      await admin.connect();

      await this.ensureTopicExists(
        admin,
        this.idpResponse,
        this.kafkaPartitionNumber,
      );
      await this.ensureTopicExists(
        admin,
        this.validateTopic,
        this.kafkaPartitionNumber,
      );

      await this.producer.connect();
      this.logger.log('Kafka producer connected successfully');
    } catch (error) {
      this.logger.error(
        `Error initializing Kafka producer: ${error.message}`,
        error.stack,
      );
      process.exit(1);
    }
  }

  private async ensureTopicExists(
    admin: Admin,
    topic: string,
    numPartitions: number,
  ): Promise<void> {
    try {
      const topics = await admin.listTopics();
      if (!topics.includes(topic)) {
        this.logger.log(`Listing topic: ${topic}`);
        await admin.createTopics({
          waitForLeaders: true,
          topics: [{ topic, numPartitions }],
        });
        this.logger.log(`Topic '${topic}' created successfully`);
      } else {
        this.logger.log(`Topic '${topic}' already exists`);
      }
    } catch (error) {
      this.logger.error(
        `Error ensuring topic '${topic}' exists: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Sends a message to a Kafka topic.
   *
   * @param kafkaOptions - Options for sending the message.
   * @returns The metadata of the sent message.
   */

  async sendMessage(
    kafkaOptions: kafkaProducerOptions,
  ): Promise<RecordMetadata> {
    try {
      const result = await this.producer.send(kafkaOptions);
      return result[0];
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
    }
  }

  public async sendKafkaMessage(
    requestInfo: RequestInfo,
    correlationId: string,
    tracingHeaderObj: any,
  ): Promise<void> {
    const producerOptions: kafkaProducerOptions = {
      topic: requestInfo.topic,
      compression: CompressionTypes.GZIP,
      acks: 1,
      messages: [
        {
          value: JSON.stringify(requestInfo),
          headers: {
            correlationId,
            partitionReply: (
              this.kafkaConsumerService.partitionId || '0'
            ).toString(),
            replyTopic: requestInfo.replyTopic,
            authorization: requestInfo.authorization || '',
            route: requestInfo.apiRoute || requestInfo.route,
            method: requestInfo.apiMethod || '',
            channel: requestInfo.channel || '',
            otp: requestInfo.otp || '',
            tracingHeaders: JSON.stringify(tracingHeaderObj),
          },
        },
      ],
    };

    await this.sendMessage(producerOptions);
  }

  /**
   * Closes the Kafka producer connection.
   */
  async onModuleDestroy(): Promise<void> {
    try {
      this.logger.log('Disconnecting from Kafka producer...');
      await this.producer.disconnect();
      this.logger.log('Kafka producer disconnected successfully');
    } catch (error) {
      this.logger.error(
        `Error disconnecting from Kafka producer: ${error.message}`,
      );
    }
  }
}
