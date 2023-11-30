import { BullModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { JobOptions } from 'bull';

export const defaultJobOptions: JobOptions = {
  attempts: 3,
  removeOnComplete: true,
};

export function createQueueOptions(
  queueName: string,
  configService: ConfigService,
): BullModuleOptions {
  return {
    name: queueName,
    redis: {
      host: configService.get('QUEUE_REDIS_HOST'),
      port: configService.get('QUEUE_REDIS_PORT'),
      username: configService.get('QUEUE_REDIS_USERNAME'),
      password: configService.get('QUEUE_REDIS_PASSWORD'),
    },
    defaultJobOptions,
  };
}