import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { removeIds } from '../utils/snapshot-utils';

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
        expect(removeIds(response.body[0])).toMatchSnapshot();
        expect(removeIds(response.body[1])).toMatchSnapshot();
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
        expect(removeIds(response.body)).toMatchSnapshot();
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
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.gliderRepository.findOne({
          where: { id: response.body.id }
        });
        expect(removeIds(db)).toMatchSnapshot();
        expect(db.id).toEqual(response.body.id);
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
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.gliderRepository.findOne({
          where: { id: response.body.id }
        });
        expect(removeIds(db)).toMatchSnapshot();
        expect(db.id).toEqual(response.body.id);
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