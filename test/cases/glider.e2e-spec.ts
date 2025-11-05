import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';

describe('Gliders (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/gliders (GET)', async () => {
    // given
    const glider = Testdata.createGlider("Ozone", "Ultralite", false);
    await testInstance.gliderRepository.save(glider);

    const glider2 = Testdata.createGlider("Advance", "Bibeta 6", true);
    await testInstance.gliderRepository.save(glider2);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get('/gliders')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toEqual({
          id: expect.any(Number),
          brand: glider2.brand,
          name: glider2.name,
          buyDate: glider2.buyDate,
          tandem: glider2.tandem,
          archived: glider2.archived,
          note: glider2.note,
          checks: null,
          nbFlights: "0",
          time: null
        });
        expect(response.body[1]).toEqual({
          id: expect.any(Number),
          brand: glider.brand,
          name: glider.name,
          buyDate: glider.buyDate,
          tandem: glider.tandem,
          archived: glider.archived,
          note: glider.note,
          checks: null,
          nbFlights: "0",
          time: null
        });
      });
  });

  it('/gliders/name/:name return most similar glider (GET)', async () => {
    // given
    const glider = Testdata.createGlider("Ozone", "Ultralite", false);
    await testInstance.gliderRepository.save(glider);

    const glider2 = Testdata.createGlider("Advance", "Bibeta 6", true);
    await testInstance.gliderRepository.save(glider2);

    const glider3 = Testdata.createGlider("Ozone", "Delta", false);
    await testInstance.gliderRepository.save(glider3);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/gliders/name/eta`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toEqual({
          id: expect.any(Number),
          brand: glider2.brand,
          name: glider2.name,
          buyDate: glider2.buyDate,
          tandem: glider2.tandem,
          archived: glider2.archived,
          note: glider2.note,
          checks: null,
          nbFlights: null,
          time: null
        });
      });
  });

  it('/gliders (POST)', async () => {
    // given
    const gliderDto = Testdata.createGliderDto("Ozone", "Ultralite", false);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/gliders')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(gliderDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body).toEqual({
          id: expect.any(Number),
          brand: gliderDto.brand,
          name: gliderDto.name,
          buyDate: gliderDto.buyDate,
          tandem: gliderDto.tandem,
          archived: gliderDto.archived,
          note: gliderDto.note,
          checks: null,
          nbFlights: null,
          time: null
        });

        const db = await testInstance.gliderRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: response.body.id,
          brand: gliderDto.brand,
          name: gliderDto.name,
          buyDate: gliderDto.buyDate,
          tandem: gliderDto.tandem,
          archived: gliderDto.archived
        });
      });
  });

  it('/gliders (PUT)', async () => {
    // given
    const glider = Testdata.createGlider("Ozone", "Ultralite", false);
    await testInstance.gliderRepository.save(glider);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    const gliderDto = Testdata.createGliderDto("Ozone", "Magnum", true);

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/gliders/${glider.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(gliderDto)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          brand: gliderDto.brand,
          name: gliderDto.name,
          buyDate: gliderDto.buyDate,
          tandem: gliderDto.tandem,
          archived: gliderDto.archived,
          note: gliderDto.note,
          checks: null,
          nbFlights: null,
          time: null
        });

        const db = await testInstance.gliderRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: response.body.id,
          brand: gliderDto.brand,
          name: gliderDto.name,
          buyDate: gliderDto.buyDate,
          tandem: gliderDto.tandem,
          archived: gliderDto.archived
        });
      });
  });

  it('/gliders (DELETE)', async () => {
    // given
    const glider = Testdata.createGlider("Ozone", "Ultralite", false);
    await testInstance.gliderRepository.save(glider);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/gliders/${glider.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.gliderRepository.count();
        expect(db).toBe(0);
      });
  });
});