import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export function createRedisClient(configService: ConfigService) {
  return new Redis({
    host: configService.get('CACHE_REDIS_HOST'),
    port: configService.get('CACHE_REDIS_PORT'),
    password: configService.get('CACHE_REDIS_PASSWORD'),
    username: configService.get('CACHE_REDIS_USERNAME'),
  });
}

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: createRedisClient,
  inject: [ConfigService],
};