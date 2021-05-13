import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const dbConfigBase: any = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA || "public",
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // autoLoadEntities: true,
    synchronize: process.env.DATABASE_SYNCHRONIZE === "false",
    migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
    migrationsTableName: 'db_migrations',
    cli: {
        migrationsDir: 'src/db/migrations'
    },
    migrationsRun: true
}

if (process.env.DATABASE_SSL === "false") {
    dbConfigBase.ssl = false;
    const dbConfig: TypeOrmModuleOptions = dbConfigBase;
} else {
    dbConfigBase.ssl = true;
    dbConfigBase.extra = {
        ssl: {
            rejectUnauthorized: false
        }
    }
    const dbConfig: TypeOrmModuleOptions = dbConfigBase;
}

export const dbConfig: TypeOrmModuleOptions = dbConfigBase;
