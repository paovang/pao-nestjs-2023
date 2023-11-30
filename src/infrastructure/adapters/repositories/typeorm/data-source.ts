import { config } from 'dotenv';
import { models } from './models';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: models, 
  migrations: [
    'src/infrastructure/adapters/repositories/typeorm/migrations/*.ts',
  ],
  synchronize: false,
};

const dataSource = new DataSource(options);

export default dataSource;