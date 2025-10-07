import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [path.join(__dirname, '/**/*.entity{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrations: [path.join(__dirname, '/migrations/**/*.ts')],
};

const AppDataSource = new DataSource(config);

export { AppDataSource };

export default config;
