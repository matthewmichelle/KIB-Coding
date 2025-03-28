import { Inject } from '@nestjs/common';

export const InjectRedis = () => Inject('RedisClient');
