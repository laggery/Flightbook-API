import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { getDatasource } from "./util";
import { DataSource } from "typeorm";
import * as fs from "fs";

const init = async () => {
    await Promise.all([
        initPostgreSql()
    ]);
};

const initPostgreSql = async () => {
    const pg = await new PostgreSqlContainer("postgis/postgis:15-3.4")
        .withUsername("flightbook_test")
        .withDatabase("flightbook_test")
        .withPassword("flightbook_test")
        .withUser("postgres")
        .start();

    global.pg = pg;

    process.env.DATABASE_HOST = pg.getHost();
    process.env.DATABASE_PORT = pg.getPort().toString();
    process.env.DATABASE_USER = pg.getUsername();
    process.env.DATABASE_PASSWORD = pg.getPassword();
    process.env.DATABASE_NAME = pg.getDatabase();
    process.env.DATABASE_SCHEMA = "public";

    const datasource = await getDatasource();
    await datasource.runMigrations();
    await insertTestData(datasource);
};

const insertTestData = async (datasource: DataSource) => {
    const importSql = fs.readFileSync("./test/it/data.sql").toString();
    for (const sql of importSql.split(";").filter((s) => s.trim() !== "")) {
        await datasource.query(sql);
    }
};

export default init;
