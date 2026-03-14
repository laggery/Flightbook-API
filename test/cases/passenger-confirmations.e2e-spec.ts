import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { removeIds } from '../utils/snapshot-utils';

describe('Tandem passenger confirmations (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/tandem/passenger-confirmations (GET)', async () => {
    // given
    const passengerConfirmation = Testdata.createPassengerConfirmation();
    await testInstance.passengerConfirmationRepository.save(passengerConfirmation);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/tandem/passenger-confirmations`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveLength(1);
        expect(removeIds(response.body[0])).toMatchSnapshot();
      });
  });

  it('/tandem/passenger-confirmations (POST)', async () => {
    // given
    const passengerConfirmationDto = Testdata.createPassengerConfirmationDto();

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/tandem/passenger-confirmations`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(passengerConfirmationDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.passengerConfirmationRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db.id).toEqual(response.body.id);
        expect(db.firstname).toEqual(response.body.firstname);
        expect(db.lastname).toEqual(response.body.lastname);
        expect(db.email).toEqual(response.body.email);
        expect(db.phone).toEqual(response.body.phone);
        expect(db.place).toEqual(response.body.place);
        expect(db.signature).toEqual(response.body.signature);
        expect(db.signatureMimeType).toEqual(response.body.signatureMimeType);
        expect(db.validation).toEqual(response.body.validation);
      });
  });

  it('/tandem/passenger-confirmations/:id (DELETE)', async () => {
    // given
    const passengerConfirmation = Testdata.createPassengerConfirmation();
    await testInstance.passengerConfirmationRepository.save(passengerConfirmation);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/tandem/passenger-confirmations/${passengerConfirmation.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.passengerConfirmationRepository.count();
        expect(db).toBe(0);
      });
  });
});