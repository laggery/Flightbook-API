import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';

describe('Places (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/places (GET)', async () => {
    // given
    const place = Testdata.createPlace("Riederalp");
    await testInstance.placeRepository.save(place);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get('/places')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toEqual({
          id: expect.any(Number),
          name: place.name,
          altitude: place.altitude,
          country: place.country,
          notes: place.notes
        });
      });
  });

  it('/places by name (GET)', async () => {
    // given
    const place = Testdata.createPlace("Riederalp");
    await testInstance.placeRepository.save(place);

    const place2 = Testdata.createPlace("Fiesch");
    await testInstance.placeRepository.save(place2);

    const place3 = Testdata.createPlace("Belalp");
    await testInstance.placeRepository.save(place3);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/places/ie`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(2);
        const names = response.body.map(place => place.name);
        expect(names).toEqual(expect.arrayContaining(['Riederalp', 'Fiesch']));
      });
  });

  it('/places (POST)', async () => {
    // given
    const placeDto = Testdata.createPlaceDto("Riederalp");
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/places')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(placeDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: placeDto.name,
          altitude: placeDto.altitude,
          country: placeDto.country,
          notes: placeDto.notes
        });

        const db = await testInstance.placeRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: response.body.id,
          name: placeDto.name,
          altitude: placeDto.altitude,
          country: placeDto.country,
          notes: placeDto.notes
        });
      });
  });

  it('/places already exists (POST)', async () => {
    // given
    const place = Testdata.createPlace("Riederalp");
    await testInstance.placeRepository.save(place);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/places')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(Testdata.createPlaceDto("Riederalp"))
      .expect(409)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('The place already exists.');
      });
  });

  it('/places (PUT)', async () => {
    // given
    const place = Testdata.createPlace("Riederalp");
    await testInstance.placeRepository.save(place);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    const placeDto = Testdata.createPlaceDto("Fiesch");

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/places/${place.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(placeDto)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: placeDto.name,
          altitude: placeDto.altitude,
          country: placeDto.country,
          notes: placeDto.notes
        });

        const db = await testInstance.placeRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: response.body.id,
          name: placeDto.name,
          altitude: placeDto.altitude,
          country: placeDto.country,
          notes: placeDto.notes
        });
      });
  });

  it('/places (DELETE)', async () => {
    // given
    const place = Testdata.createPlace("Riederalp");
    await testInstance.placeRepository.save(place);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/places/${place.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.placeRepository.count();
        expect(db).toBe(0);
      });
  });
});