import * as request from 'supertest';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';

describe('ConfigurationController (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/map (GET)', async () => {
    // given
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get('/configuration/map')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body).toMatchSnapshot();
      });
  });

  it('/version-check Optional update (POST)', async () => {
    // given
    const versionCheckRequest = {
      platform: 'ios',
      version: '1.0.0',
      build_number: 1,
      os_version: '14',
      locale: 'de',
    };

    //when
    return request(testInstance.app.getHttpServer())
      .post('/configuration/version-check')
      .send(versionCheckRequest)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body).toMatchSnapshot();
      });
  });

  it('/version-check Force update (POST)', async () => {
    // given
    const versionCheckRequest = {
      platform: 'ios',
      version: '1.0.0',
      build_number: 0,
      os_version: '14',
      locale: 'de',
    };

    //when
    return request(testInstance.app.getHttpServer())
      .post('/configuration/version-check')
      .send(versionCheckRequest)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body).toMatchSnapshot();
      });
  });

  it('/version-check Up to date (POST)', async () => {
    // given
    const versionCheckRequest = {
      platform: 'ios',
      version: '1.0.0',
      build_number: 2,
      os_version: '14',
      locale: 'de',
    };

    //when
    return request(testInstance.app.getHttpServer())
      .post('/configuration/version-check')
      .send(versionCheckRequest)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body).toMatchSnapshot();
      });
  });
});
