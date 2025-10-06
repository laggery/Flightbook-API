import { Test } from "@nestjs/testing";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { AppModule } from "../src/app.module";
import { DataSource } from "typeorm";
import { NewsRepository } from "../src/news/news.repository";
import { ControlSheetRepository } from "../src/training/control-sheet/control-sheet.repository";
import { UserRepository } from "../src/user/user.repository";
import { Testdata } from "./testdata";
import { MockKeycloakStrategy } from "./mock-keycloak.strategy";
import { KeycloakStrategy } from "../src/auth/strategy/keycloak.strategy";
import { PlaceRepository } from "../src/place/place.repository";

const init = async () => {
    await initPostgreSql();
    process.env.JWT_SECRET = 'test-secret';
    process.env.STRIPE_ENDPOINT_SECRET = 'test';
    process.env.STRIPE_SECRET_KEY = 'test';

    // Create test DataSource
    const testDataSource = new DataSource({
        type: 'postgres',
        host: global.pg.getHost(),
        port: global.pg.getPort(),
        username: global.pg.getUsername(),
        password: global.pg.getPassword(),
        database: global.pg.getDatabase(),
        schema: 'data',
        entities: [__dirname + '/../src/**/*.entity.{ts,js}'],
        migrations: [__dirname + '/../src/db/migrations/*{.ts,.js}'],
        migrationsTableName: 'db_migrations',
        migrationsRun: true
    });

    await testDataSource.initialize();

    const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(DataSource)
        .useValue(testDataSource)
        .overrideProvider(KeycloakStrategy)
        .useClass(MockKeycloakStrategy)
        .compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    const newsRepository = moduleFixture.get<NewsRepository>(NewsRepository);
    const controlSheetRepository = moduleFixture.get<ControlSheetRepository>(ControlSheetRepository);
    const userRepository = moduleFixture.get<UserRepository>(UserRepository);
    const placeRepository = moduleFixture.get<PlaceRepository>(PlaceRepository);

    // Store globally for all tests to use
    (global as any).testApp = app;
    (global as any).testModuleFixture = moduleFixture;
    (global as any).testDataSource = testDataSource;
    (global as any).testNewsRepository = newsRepository;
    (global as any).testUserRepository = userRepository;
    (global as any).testControlSheetRepository = controlSheetRepository;
    (global as any).testPlaceSheetRepository = placeRepository;

    await userRepository.save(Testdata.createUser());
};

const initPostgreSql = async () => {
    const pg = await new PostgreSqlContainer("postgis/postgis:15-3.4")
        .withUsername("flightbook_test")
        .withDatabase("flightbook_test")
        .withPassword("flightbook_test")
        .withUser("postgres")
        .withCopyFilesToContainer([{
            source: "./test/init-schema.sql",
            target: "/docker-entrypoint-initdb.d/init-schema.sql"
        }])
        .withExposedPorts(54322)
        .start();

    global.pg = pg;

    process.env.DATABASE_HOST = pg.getHost();
    process.env.DATABASE_PORT = pg.getPort().toString();
    process.env.DATABASE_USER = pg.getUsername();
    process.env.DATABASE_PASSWORD = pg.getPassword();
    process.env.DATABASE_NAME = pg.getDatabase();
    process.env.DATABASE_SCHEMA = "data";
};

export default init;
