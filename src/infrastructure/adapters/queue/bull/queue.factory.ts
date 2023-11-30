import { ConfigService } from '@nestjs/config';
import { createQueueOptions } from '@/common/configurations/queue.config';

export function queueFactory(
  queueName: string,
  configService: ConfigService,
) {
  try {
    return createQueueOptions(queueName, configService);
  } catch (error) {
    throw error;
  }
}