import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { EventEmitterService } from './kafka.service.event-emitter';
import { AppConfigService } from '../../helper-modules/app-config/app-config.service';
import { KafkaFactoryService } from './kafka.factory.service';

/**
 * Kafka consumer service for handling messages from Kafka topics.
 */
@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  public consumer: Consumer;
  private readonly logger = new Logger(KafkaConsumerService.name);
  private idpResponse: string;
  private validateTopic: string;
  public partitionId: number;
  public interval: number;
  private kafkaPartitionNumber: number;

  constructor(
    private appConfigService: AppConfigService,
    private readonly eventEmitterService: EventEmitterService,

    private readonly kafkaFactoryService: KafkaFactoryService,
  ) {
    this.idpResponse = this.appConfigService.getKafkaTopics().idpResponse;
    this.validateTopic = this.appConfigService.getKafkaTopics().validateTopic;
    this.kafkaPartitionNumber = this.appConfigService.getkafkaPartitionNumber();
  }

  /**
   * Initializes the Kafka consumer and subscribes to the specified topics.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.initializeConsumer();
      await this.subscribeToTopics();
    } catch (error) {
      this.logger.error(`Error initializing Kafka consumer: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Closes the Kafka consumer connection.
   */
  async onModuleDestroy(): Promise<void> {
    try {
      await this.disconnectConsumer();
    } catch (error) {
      this.logger.error(`Error closing Kafka consumer: ${error.message}`);
    }
  }

  /**
   * Initializes the Kafka consumer with the provided configuration.
   */
  private async initializeConsumer(): Promise<void> {
    const kafka = this.kafkaFactoryService.createKafkaInstance();
    this.consumer = kafka.consumer({
      groupId: this.appConfigService.getKafkaConsumerGroupId(),
    });

    await this.consumer.connect();

    await this.createKafkaTopic(
      this.idpResponse,
      this.kafkaPartitionNumber,
      kafka,
    );
    await this.createKafkaTopic(
      this.validateTopic,
      this.kafkaPartitionNumber,
      kafka,
    );
  }

  /**
   * Subscribes the Kafka consumer to the specified topics and sets up event listeners.
   */
  private async subscribeToTopics(): Promise<void> {
    const topics = [this.idpResponse, this.validateTopic];
    await this.consumer.subscribe({ topics });
    this.logger.log(`Subscribed to topics: ${topics.join(', ')}`);

    const consumerAssignments: { [key: string]: number } = {};
    this.consumer.on(this.consumer.events.GROUP_JOIN, (data: any) => {
      Object.keys(data.payload.memberAssignment).forEach((memberId) => {
        consumerAssignments[memberId] = Math.min(
          ...data.payload.memberAssignment[memberId],
        );
        this.partitionId =
          consumerAssignments[(this.idpResponse, this.validateTopic)];
      });
    });
    this.consumer.on(this.consumer.events.HEARTBEAT, ({ timestamp }) => {
      this.interval = timestamp; //
    });

    await this.consumer.run({
      eachMessage: this.handleMessage.bind(this),
    });

    this.logger.log('Kafka consumer initialized successfully');
  }

  /**
   * Closes the Kafka consumer connection.
   */
  private async disconnectConsumer(): Promise<void> {
    this.logger.log('Closing Kafka consumer...');
    await this.consumer.disconnect();
    this.logger.log('Kafka consumer closed successfully');
  }

  /**
   * Handles each incoming message by parsing it, extracting the correlation ID,
   * and triggering the event emitter service.
   * @param payload - The Kafka message payload.
   */
  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, message } = payload;
    try {
      const messageContent = message.value.toString();
      const parsedMessage = JSON.parse(messageContent);
      const correlationId = message.headers?.correlationId?.toString();
      if (correlationId) {
        await this.eventEmitterService.fireEvent(correlationId, parsedMessage);
        await this.commitMessageOffset(payload);
      } else {
        this.logger.warn(
          `Skipping message with missing correlation ID from topic: ${topic}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error handling message from topic ${topic}: ${error.message}`,
      );
    }
  }

  /**
   * Commits the offset of the processed message to Kafka.
   * @param payload - The Kafka message payload.
   */
  private async commitMessageOffset(
    payload: EachMessagePayload,
  ): Promise<void> {
    const { topic, partition, message } = payload;
    await this.consumer.commitOffsets([
      { topic, partition, offset: message.offset },
    ]);
  }

  private async createKafkaTopic(
    topic: string,
    partitionNumber: number,
    client: any,
  ): Promise<void> {
    const admin = client.admin();
    try {
      const topicData = await admin.fetchTopicMetadata({ topics: [topic] });
      if (topicData && topicData.topics && topicData.topics.length) {
        if (topicData.topics[0].partitions.length < partitionNumber) {
          await admin.createPartitions({
            timeout: 5000,
            topicPartitions: [
              {
                topic,
                count: partitionNumber,
              },
            ],
          });
        }
      }
    } catch (e) {
      // @ts-ignore
      if (e.message === 'This server does not host this topic-partition') {
        await admin.createTopics({
          validateOnly: false,
          waitForLeaders: false,
          timeout: 5000,
          topics: [
            {
              topic,
              numPartitions: partitionNumber,
              replicationFactor: 1,
              replicaAssignment: [],
              configEntries: [],
            },
          ],
        });
      } else {
        // @ts-ignore
        throw new Error(e);
      }
    }
  }
}
