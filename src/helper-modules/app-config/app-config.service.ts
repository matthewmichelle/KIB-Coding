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

  private readonly cryptoPassPhrase =
    this.configService.get<string>('CRYPTO_PASSPHRASE');

  private readonly cryptoKeyPath =
    this.configService.get<string>('CRYPTO_KEY_PATH');

  private readonly tokenIssuer = this.configService.get<string>('TOKEN_ISSUER');

  private readonly tokenAudience =
    this.configService.get<string>('TOKEN_AUDIENCE');

  private readonly redisUrl = this.configService.get<string>('REDIS_URL');

  getPromiseTimeout = (): number => this.promiseTimeout;
  getAppPort = (): number => this.appPort;
  getDdbUrl = (): string => this.dbUrl;

  getRedisUrl = (): string => this.redisUrl;

  getJwtSecret = (): string => this.jwtSecret;
  getJwtAccessExpiration = (): string => this.jwtAccessExpiration;
  getJwtRefreshExpiration = (): string => this.jwtRefreshExpiration;
  getCorsUrl = (): string => this.corsUrl;
  getCryptoKeyPath = (): string => String(this.cryptoKeyPath);
  getCryptoPassPhrase = (): any => this.cryptoPassPhrase;

  getTokenIssuer = (): string => String(this.tokenIssuer);
  getTokenAudience = (): any => this.tokenAudience;
}
