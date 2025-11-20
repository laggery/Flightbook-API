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
import { GliderRepository } from "../src/glider/glider.repository";
import { FlightRepository } from "../src/flight/flight.repository";
import { VERSION_NEUTRAL, VersioningType } from "@nestjs/common";
import { KeycloakService } from "../src/auth/service/keycloak.service";
import { MockKeycloakService } from "./mock-keycloak.service";
import { SchoolRepository } from "../src/training/school/school.repository";
import { TeamMemberRepository } from "../src/training/team-member/team-member.repository";
import { EnrollmentRepository } from "../src/training/enrollment/enrollment.repository";
import { StudentRepository } from "../src/training/student/student.repository";
import { NoteRepository } from "../src/training/note/note.repository";

const init = async () => {
    process.env.TZ = 'UTC';

    await initPostgreSql();
    process.env.JWT_SECRET = 'test-secret';
    process.env.STRIPE_ENDPOINT_SECRET = 'test';
    process.env.STRIPE_SECRET_KEY = 'test';
    process.env.ORIGIN_INSTRUCTOR = Testdata.INSTRUCTOR_APP_ORIGIN;
    process.env.ORIGIN_MOBILE = Testdata.MOBILE_APP_ORIGIN;

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
        .overrideProvider(KeycloakService)
        .useClass(MockKeycloakService)
        .compile();

    const app = moduleFixture.createNestApplication();
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: VERSION_NEUTRAL
    });
    await app.init();

    const newsRepository = moduleFixture.get<NewsRepository>(NewsRepository);
    const controlSheetRepository = moduleFixture.get<ControlSheetRepository>(ControlSheetRepository);
    const userRepository = moduleFixture.get<UserRepository>(UserRepository);
    const placeRepository = moduleFixture.get<PlaceRepository>(PlaceRepository);
    const gliderRepository = moduleFixture.get<GliderRepository>(GliderRepository);
    const flightRepository = moduleFixture.get<FlightRepository>(FlightRepository);
    const schoolRepository = moduleFixture.get<SchoolRepository>(SchoolRepository);
    const teamMemberRepository = moduleFixture.get<TeamMemberRepository>(TeamMemberRepository);
    const enrollmentRepository = moduleFixture.get<EnrollmentRepository>(EnrollmentRepository);
    const studentRepository = moduleFixture.get<StudentRepository>(StudentRepository);
    const noteRepository = moduleFixture.get<NoteRepository>(NoteRepository);

    // Store globally for all tests to use
    (global as any).testApp = app;
    (global as any).testModuleFixture = moduleFixture;
    (global as any).testDataSource = testDataSource;
    (global as any).testNewsRepository = newsRepository;
    (global as any).testUserRepository = userRepository;
    (global as any).testControlSheetRepository = controlSheetRepository;
    (global as any).testPlaceRepository = placeRepository;
    (global as any).testGliderRepository = gliderRepository;
    (global as any).testFlightRepository = flightRepository;
    (global as any).testSchoolRepository = schoolRepository;
    (global as any).testTeamMemberRepository = teamMemberRepository;
    (global as any).testEnrollmentRepository = enrollmentRepository;
    (global as any).testStudentRepository = studentRepository;
    (global as any).testNoteRepository = noteRepository;

    await userRepository.save(Testdata.getDefaultUser());
};

const initPostgreSql = async () => {
    const pg = await new PostgreSqlContainer("postgis/postgis:15-3.4")
        .withUsername("flightbook_test")
        .withDatabase("flightbook_test")
        .withPassword("flightbook_test")
        .withUser("postgres")
        .withEnvironment({ "TZ": "UTC" })
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
