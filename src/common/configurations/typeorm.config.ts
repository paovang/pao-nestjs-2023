import { models } from '@/infrastructure/adapters/repositories/typeorm/models';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export enum DatabaseConnection {
  Main = 'main-connection',
}

export const typeOrmOption = (): TypeOrmModuleAsyncOptions => ({
  name: DatabaseConnection.Main,
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DATABASE_HOST'),
    port: +config.get('DATABASE_PORT'),
    username: config.get('DATABASE_USERNAME'),
    password: config.get('DATABASE_PASSWORD'),
    database: config.get('DATABASE_NAME'),
    entities: models,
    synchronize: config.get('DATABASE_SYNCHRONIZE', false) === 'true' ? true : false,
    logging: config.get('DATABASE_LOGGING', false) === 'true' ? true : false,
  }),
  inject: [ConfigService],
}); 