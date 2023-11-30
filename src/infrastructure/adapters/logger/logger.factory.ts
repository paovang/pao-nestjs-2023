import { ConfigService } from '@nestjs/config';
import { createLogger } from '@/common/configurations/logger.config';

export function loggerFactory(configService: ConfigService) {
  return createLogger(configService);
}