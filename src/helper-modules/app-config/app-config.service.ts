import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  private readonly appPort = this.configService.get<number>('PORT');
  private readonly dbUrl = this.configService.get<string>('DB_URL');
  private readonly corsUrl = this.configService.get<string>('CORS_URL');
  private readonly promiseTimeout =
    this.configService.get<number>('PROMISE_TIMEOUT');
  private readonly jwtSecret = this.configService.get<string>('JWT_SECRET');
  private readonly jwtAccessExpiration =
    this.configService.get<string>('JWT_ACCESS_EXPIRE');
  private readonly jwtRefreshExpiration =
    this.configService.get<string>('JWT_REFRESH_EXPIRE');

  private readonly kafkaClientId =
    this.configService.get<string>('KAFKA_CLIENT_ID');
  private readonly kafkaBrokerUrl =
    this.configService.get<string>('KAFKA_HOSTS');
  private readonly kafkaRequestTimeout =
    this.configService.get<string>('KAFKA_TIMEOUT');
  private readonly kafkaRetries = {
    retries: Number(this.configService.get<string>('KAFKA_RETRIES') || '3'),
    initialRetryTime: Number(
      this.configService.get<string>('KAFKA_INITIAL_RETRY_TIME') || '1',
    ),
  };
  private readonly kafkaProducerPolicy = {
    allowAutoTopicCreation: true,
  };

  private readonly kafkaConnectionTimeout = this.configService.get<string>(
    'KAFKA_CONNECTION_TIMEOUT',
  );

  private readonly kafkaConsumerGroupId =
    this.configService.get<string>('CONSUMER_GROUP_ID');

  private readonly kafkaEnterprise = this.configService.get<string>(
    'KAFKA_ENTERPRISE_ON',
  );

  private readonly kafkaBrokers = this.configService.get<string>('BROKERS');
  private readonly kafkaUserName =
    this.configService.get<string>('KAFKA_USERNAME');

  private readonly kafkaPassword =
    this.configService.get<string>('KAFKA_PASSWORD');

  private readonly kafkaPartitionNumber =
    this.configService.get<number>('KAFKA_PARTITION_NUMBER') || 3;

  private readonly kafkaTopicId =
    this.configService.get<string>('KAFKA_TOPIC_ID');

  private readonly kafkaTopics = {
    t24Request: `t24Request-${this.kafkaTopicId}`,
    idpResponse: `idpResponse-${this.kafkaTopicId}`,
    niRequest: `niRequest-${this.kafkaTopicId}`,
    euronetRequest: `euronetRequest-${this.kafkaTopicId}`,
    validateTopic: `validateTopic-${this.kafkaTopicId}`,
    sendEmail: `sendEmail-${this.kafkaTopicId}`,
    smtp: `smtp-${this.kafkaTopicId}`,
    statistics: `statistics-${this.kafkaTopicId}`,
    kibana: `kibanastatistics-${this.kafkaTopicId}`,
    customerResponse: `customerResponse-${this.kafkaTopicId}`,
  };

  private corporateRange = {
    min: 2000,
    max: 4999,
  };

  private readonly cryptoPassPhrase =
    this.configService.get<string>('CRYPTO_PASSPHRASE');

  private readonly cryptoKeyPath =
    this.configService.get<string>('CRYPTO_KEY_PATH');

  private readonly tokenIssuer = this.configService.get<string>('TOKEN_ISSUER');

  private readonly tokenAudience =
    this.configService.get<string>('TOKEN_AUDIENCE');

  private readonly isEnCryption = this.configService.get<string>('ENCRYPTION');

  private readonly allSector = this.configService.get<string>('ALL_SECTOR');

  getPromiseTimeout = (): number => this.promiseTimeout;
  getAppPort = (): number => this.appPort;
  getDdbUrl = (): string => this.dbUrl;
  getJwtSecret = (): string => this.jwtSecret;
  getJwtAccessExpiration = (): string => this.jwtAccessExpiration;
  getJwtRefreshExpiration = (): string => this.jwtRefreshExpiration;
  getCorsUrl = (): string => this.corsUrl;

  // kafka
  getkafkaClientId = (): string => this.kafkaClientId;
  getkafkaBrokerUrl = (): string => this.kafkaBrokerUrl;
  getkafkaProducerPolicy = (): any => this.kafkaProducerPolicy;
  getkafkaRequestTimeout = (): number =>
    Number(this.kafkaRequestTimeout || 3000);
  getkafkaRetries = (): any => this.kafkaRetries;
  getKafkaConnectionTimeout = (): number =>
    Number(this.kafkaConnectionTimeout || 3000);
  getKafkaConsumerGroupId = (): string =>
    String(this.kafkaConsumerGroupId || 'ipd-ms');
  getKafkaTopics = (): any => this.kafkaTopics;

  getKafkaEnterprise = (): string => this.kafkaEnterprise;
  getKafkaBrokers = (): string => this.kafkaBrokers;

  getKafkaEnterpriseUserName = (): string => this.kafkaUserName;

  getKafkaEnterprisePassword = (): string => this.kafkaPassword;

  getkafkaPartitionNumber = (): number => this.kafkaPartitionNumber;

  getCryptoKeyPath = (): string => String(this.cryptoKeyPath);
  getCryptoPassPhrase = (): any => this.cryptoPassPhrase;

  getTokenIssuer = (): string => String(this.tokenIssuer);
  getTokenAudience = (): any => this.tokenAudience;

  getIsEnCryption = (): any => this.isEnCryption;

  getCorporateRange = (): any => this.corporateRange;
  getAllSector = (): any => this.allSector;
}
