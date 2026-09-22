import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Resolves to the repo-root .env from both src/ (ts-node) and dist/ (compiled).
// Inside docker the vars are injected by compose and no file is present, which
// dotenv treats as a no-op.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Managed providers (Supabase, Render) terminate TLS with a cert chain node-pg
  // will not verify by default.
  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [path.join(__dirname, '/**/*.entity{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
};

const AppDataSource = new DataSource(config);

export { AppDataSource };

export default config;
