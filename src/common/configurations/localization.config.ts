import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const i18nConfigFactory = (configService: ConfigService) => {
  const env = configService.get<string>('NODE_ENV', 'development');
  const isProd = env === 'production';

  return {
    fallbackLanguage: 'lo',
    loaderOptions: {
      path: join(__dirname, '../localization/'),
      watch: !isProd,
    },
  };
};