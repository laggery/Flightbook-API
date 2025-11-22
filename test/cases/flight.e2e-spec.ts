import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { Flight } from '../../src/flight/flight.entity';
import { FlightDto } from '../../src/flight/interface/flight-dto';
import { plainToClass } from 'class-transformer';
import { removeIds } from '../utils/snapshot-utils';
import { User } from '../../src/user/domain/user.entity';
import { FlightValidationState } from '../../src/flight/flight-validation-state';

describe('Flights (e2e)', () => {
  const testInstance = new BaseE2ETest();
  const storedFlights: Flight[] = [];

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
    storedFlights.length = 0;
    storedFlights.push(...(await createData(testInstance)));
  });

  it('/flights (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get('/flights')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveLength(4);

        // Flights should be ordered by date desc, then by timestamp desc
        assertFlight(response.body[0], storedFlights[3]);
        assertFlight(response.body[1], storedFlights[2]);
        assertFlight(response.body[2], storedFlights[1]);
        assertFlight(response.body[3], storedFlights[0]);
      });
  });

  it('/flights/:id (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken();
    const expectedFlightDto = {
      ...plainToClass(FlightDto, storedFlights[0]),
      time: storedFlights[0].time + ':00'
    };

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/flights/${storedFlights[0].id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/flights (POST)', async () => {
    // given
    const places = await testInstance.placeRepository.find();
    const gliders = await testInstance.gliderRepository.find();
    const flightDto = Testdata.createFlightDto(places[0], places[1], gliders[0], '2025-01-02');
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/flights')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(flightDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.flightRepository.findOne({
          where: { id: response.body.id }
        });
        expect(removeIds(db)).toMatchSnapshot();
        expect(db.id).toEqual(response.body.id);
        expect(db.gliderId).toEqual(response.body.glider.id);
        expect(db.startId).toEqual(response.body.start.id);
        expect(db.landingId).toEqual(response.body.landing.id);
      });
  });

  it('/flights (PUT)', async () => {
    // given
    const flight = storedFlights[0];
    const flightDto = {
      ...Testdata.createFlightDto(flight.start, flight.landing, flight.glider, flight.date),
      km: 200.5,
      time: "02:15",
      description: "Updated description"
    };
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/flights/${flight.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(flightDto)
      .expect(200)
      .then(async (response) => {
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.flightRepository.findOne({
          where: { id: response.body.id }
        });
        expect(removeIds(db)).toMatchSnapshot();
        expect(db.id).toEqual(response.body.id);
        expect(db.gliderId).toEqual(response.body.glider.id);
        expect(db.startId).toEqual(response.body.start.id);
        expect(db.landingId).toEqual(response.body.landing.id);
      });
  });

  it('/flights (DELETE)', async () => {
    // given
    const flight = storedFlights[0];
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/flights/${flight.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.flightRepository.count();
        expect(db).toBe(3);
      });
  });

  it('/flights/statistic (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get('/flights/statistic')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toMatchSnapshot();
      });
  });

  it('/flights/places/:id (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken();
    const place = storedFlights[0].start;
    //when
    return request(testInstance.app.getHttpServer())
      .get(`/flights/places/${place.id}/count`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.nbFlights).toEqual("2");
      });
  });

  it('/flights/gliders/:id (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken();
    const glider = storedFlights[0].glider;
    //when
    return request(testInstance.app.getHttpServer())
      .get(`/flights/gliders/${glider.id}/count`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.nbFlights).toEqual("2");
      });
  });
});

describe('V2 Flights (e2e)', () => {
  const testInstance = new BaseE2ETest();
  const storedFlights: Flight[] = [];

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
    storedFlights.length = 0;
    storedFlights.push(...(await createData(testInstance)));
  });
  it('/v2/flights (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get('/v2/flights')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot();
        expect(response.body.entity).toHaveLength(4);

        // Flights should be ordered by date desc, then by timestamp desc
        assertFlight(response.body.entity[0], storedFlights[3]);
        assertFlight(response.body.entity[1], storedFlights[2]);
        assertFlight(response.body.entity[2], storedFlights[1]);
        assertFlight(response.body.entity[3], storedFlights[0]);
      });
  });

  it('/v2/flights/statistic (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get('/v2/flights/statistic')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0]).toMatchSnapshot();
      });
  });
});

describe('Instructor Flight (e2e)', () => {
  const testInstance = new BaseE2ETest();
  const storedFlights: Flight[] = [];
  let schoolTestData: any;

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
    schoolTestData = await testInstance.createSchoolData();
    storedFlights.length = 0;
    storedFlights.push(...(await createData(testInstance, schoolTestData.studentUser)));
  });

  it('/instructor/students/:id/flights (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: schoolTestData.instructorUser.id, email: schoolTestData.instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/instructor/students/${schoolTestData.student.id}/flights`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body.entity).toHaveLength(4);

        // Flights should be ordered by date desc, then by timestamp desc
        assertFlight(response.body.entity[0], storedFlights[3]);
        assertFlight(response.body.entity[1], storedFlights[2]);
        assertFlight(response.body.entity[2], storedFlights[1]);
        assertFlight(response.body.entity[3], storedFlights[0]);
      });
  });

  it('/instructor/students/:id/flights/:flightId (PUT)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: schoolTestData.instructorUser.id, email: schoolTestData.instructorUser.email });
    const flightDto = {
      ...plainToClass(FlightDto, storedFlights[0]),
      shvAlone: true
    };
    expect(storedFlights[0].shvAlone).toBe(false);

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/instructor/students/${schoolTestData.student.id}/flights/${storedFlights[0].id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(flightDto)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.shvAlone).toBe(true);

        const db = await testInstance.flightRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db.shvAlone).toBe(true);
      });
  });
});

describe('Instructor Flight Validation (e2e)', () => {
  const testInstance = new BaseE2ETest();
  const storedFlights: Flight[] = [];
  let schoolTestData: any;

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
    schoolTestData = await testInstance.createSchoolData();
    storedFlights.length = 0;
    storedFlights.push(...(await createData(testInstance, schoolTestData.studentUser)));
  });

  it('/instructor/schools/:school_id/students/:id/flights/:flightId (PUT)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: schoolTestData.instructorUser.id, email: schoolTestData.instructorUser.email });
    const flightValidationDto = {
      state: FlightValidationState.VALIDATED,
      comment: 'Validated',
      instructor: schoolTestData.instructorUser,
      school: schoolTestData.school
    };

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/instructor/schools/${schoolTestData.testSchool.id}/students/${schoolTestData.student.id}/flights/${storedFlights[0].id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(flightValidationDto)
      .expect(200)
      .then(async (response) => {
        expect(removeIds(response.body)).toMatchSnapshot({
          validation: {
            timestamp: expect.any(String)
          }
        });

        const db = await testInstance.flightRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db.validation.state).toBe(FlightValidationState.VALIDATED);
        expect(db.validation.comment).toBe('Validated');
      });
  });

  it('/instructor/schools/:school_id/students/:id/flights/validate-all (PUT)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: schoolTestData.instructorUser.id, email: schoolTestData.instructorUser.email });
    const flightValidationDto = {
      state: FlightValidationState.VALIDATED,
      instructor: schoolTestData.instructorUser,
      school: schoolTestData.school
    };

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/instructor/schools/${schoolTestData.testSchool.id}/students/${schoolTestData.student.id}/flights/validate-all`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(flightValidationDto)
      .expect(204)
      .then(async () => {
        for (const flight of storedFlights) {
          const db = await testInstance.flightRepository.findOne({
            where: { id: flight.id }
          });
          expect(db.validation.state).toBe(FlightValidationState.VALIDATED);
          expect(db.validation.comment).toBeNull();
        }
      });
  });
});


async function createData(testInstance: BaseE2ETest, user?: User): Promise<Flight[]> {
  // Create places
  const places = [
    Testdata.createPlace("riederalp", user),
    Testdata.createPlace("Fiesch", user),
    Testdata.createPlace("Belalp", user),
    Testdata.createPlace("Bitsch", user),
    Testdata.createPlace("Zermatt", user)
  ];
  for (const place of places) {
    await testInstance.placeRepository.save(place);
  }

  const countPlaces = await testInstance.placeRepository.count();
  expect(countPlaces).toEqual(5);

  // Create gliders
  const gliders = [
    Testdata.createGlider("Advance", "Bibeta 6", true, user),
    Testdata.createGlider("Ozone", "Delta", false, user),
    Testdata.createGlider("Gin", "Yeti", false, user)
  ];
  for (const g of gliders) {
    await testInstance.gliderRepository.save(g);
  }

  const countGliders = await testInstance.gliderRepository.count();
  expect(countGliders).toEqual(3);

  const flights = [
    Testdata.createFlight(places[0], places[1], gliders[0], '2025-01-01', new Date('2025-01-01T10:00:00Z'), user),
    Testdata.createFlight(places[0], places[1], gliders[0], '2025-01-01', new Date('2025-01-01T12:00:00Z'), user), // Duplicate flight on same day with different timestamp
    Testdata.createFlight(places[1], places[2], gliders[1], '2025-01-02', undefined, user),
    Testdata.createFlight(places[2], places[3], gliders[2], '2025-01-03', undefined, user)
  ];

  for (const f of flights) {
    await testInstance.flightRepository.save(f);
  }

  const countFlights = await testInstance.flightRepository.count();
  expect(countFlights).toEqual(4);

  return flights;
}

function assertFlight(received: any, expected: Flight | FlightDto) {
  expect(received).toMatchObject({
    id: expected.id ? expected.id : expect.any(Number),
    date: expected instanceof Flight ? new Date(expected.date).toISOString() : expected.date,
    km: expected.km,
    time: expected instanceof Flight ? expected.time + ':00' : expected.time,
    description: expected.description,
    start: {
      id: expected.start.id,
      name: expected.start.name
    },
    landing: {
      id: expected.landing.id,
      name: expected.landing.name
    },
    glider: {
      id: expected.glider.id,
      brand: expected.glider.brand,
      name: expected.glider.name
    }
  });
}
