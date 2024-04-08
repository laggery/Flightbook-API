import { DataSource } from "typeorm";
import * as process from "process";

let datasource: DataSource;

export const getDatasource = async () => {
    if (datasource) {
        return datasource;
    }
    datasource = new DataSource({
        type: "postgres",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true,
        logging: true,
        entities: [`**/*.entity.ts`],
        relationLoadStrategy: "join",
    });
    await datasource.initialize();
    return datasource;
};


