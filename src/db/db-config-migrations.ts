import { cwd, env } from 'process';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const datasource = new DataSource({
    type: 'postgres',
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    schema: "public",
    entities: [cwd() + '/src/**/*.entity.ts'],
    migrations: [cwd() + '/src/db/migrations/*.ts'],
    migrationsTableName: 'db_migrations',
    migrationsRun: true
});
datasource.initialize();
export default datasource;