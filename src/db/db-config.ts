import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // autoLoadEntities: true,
    synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
    migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
    migrationsTableName: 'db_migrations',
    cli: {
        migrationsDir: 'src/db/migrations'
    },
    migrationsRun: true
}