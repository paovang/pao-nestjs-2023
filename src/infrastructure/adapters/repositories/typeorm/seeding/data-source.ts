import { config } from 'dotenv';
import { models } from '../models';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import { userSeeders } from '../../../../../modules/user/data-typeorm/seeds/index';

config();

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: models,
    factories: [],
    seeds: [
        ...userSeeders
    ],
  };
  
  const dataSource = new DataSource(options);
  dataSource.initialize().then(async () => {
    await runSeeders(dataSource);
  });