import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { Flight } from '../../src/flight/flight.entity';
import { FlightDto } from '../../src/flight/interface/flight-dto';
import { plainToClass } from 'class-transformer';

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
        expect(response.body).toBeDefined();
        assertFlight(response.body, expectedFlightDto);
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
        expect(response.body).toBeDefined();
        assertFlight(response.body, flightDto);

        const db = await testInstance.flightRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: response.body.id,
          date: response.body.date.substring(0, 10),
          km: response.body.km,
          time: response.body.time + ':00',
          description: response.body.description,
          gliderId: response.body.glider.id,
          startId: response.body.start.id,
          landingId: response.body.landing.id,
        });
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
        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        assertFlight(response.body, flightDto);

        const db = await testInstance.flightRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: response.body.id,
          date: response.body.date.substring(0, 10),
          km: response.body.km,
          time: response.body.time + ':00',
          description: response.body.description,
          gliderId: response.body.glider.id,
          startId: response.body.start.id,
          landingId: response.body.landing.id,
        });
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
        expect(response.body).toBeDefined();
        expect(response.body.time).toEqual("21600.000000");
        expect(response.body.average).toEqual("5400.000000");
        expect(response.body.totalDistance).toEqual(400.8);
        expect(response.body.bestDistance).toEqual(100.2);
        expect(response.body.nbFlights).toEqual(4);
        expect(response.body.nbLandingplaces).toEqual(3);
        expect(response.body.nbStartplaces).toEqual(3);
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
        expect(response.body.entity).toHaveLength(4);
        expect(response.body.currentPage).toBe(1);
        expect(response.body.itemCount).toBe(4);
        expect(response.body.totalItems).toBe(4);
        expect(response.body.totalPages).toBe(1);

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
        expect(response.body[0].nbFlights).toEqual(4);
        expect(response.body[0].average).toEqual("5400.000000");
        expect(response.body[0].time).toEqual("21600.000000");
        expect(response.body[0].totalDistance).toEqual(400.8);
        expect(response.body[0].bestDistance).toEqual(100.2);
        expect(response.body[0].type).toEqual("yearly");
        expect(response.body[0].year).toEqual("2025");
      });
  });
});

async function createData(testInstance: BaseE2ETest): Promise<Flight[]> {
  // Create places
  const places = [
    Testdata.createPlace("riederalp"),
    Testdata.createPlace("Fiesch"),
    Testdata.createPlace("Belalp"),
    Testdata.createPlace("Bitsch"),
    Testdata.createPlace("Zermatt")
  ];
  for (const place of places) {
    await testInstance.placeRepository.save(place);
  }

  const countPlaces = await testInstance.placeRepository.count();
  expect(countPlaces).toEqual(5);

  // Create gliders
  const gliders = [
    Testdata.createGlider("Advance", "Bibeta 6", true),
    Testdata.createGlider("Ozone", "Delta", false),
    Testdata.createGlider("Gin", "Yeti", false)
  ];
  for (const g of gliders) {
    await testInstance.gliderRepository.save(g);
  }

  const countGliders = await testInstance.gliderRepository.count();
  expect(countGliders).toEqual(3);

  const flights = [
    Testdata.createFlight(places[0], places[1], gliders[0], '2025-01-01', new Date('2025-01-01T10:00:00Z')),
    Testdata.createFlight(places[0], places[1], gliders[0], '2025-01-01', new Date('2025-01-01T12:00:00Z')), // Duplicate flight on same day with different timestamp
    Testdata.createFlight(places[1], places[2], gliders[1], '2025-01-02'),
    Testdata.createFlight(places[2], places[3], gliders[2], '2025-01-03')
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
