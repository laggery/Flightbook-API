import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { removeIds } from '../utils/snapshot-utils';

describe('instructor appointment type (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/instructor/schools/:id/appointment-types (GET)', async () => {
    // given
    const { instructorUser, testSchool } = await testInstance.createSchoolData();
    const appointmentType = Testdata.createAppointmentType("appointment type");
    await testInstance.appointmentTypeRepository.save(appointmentType);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/instructor/schools/${testSchool.id}/appointment-types`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/instructor/schools/:id/appointment-types (POST)', async () => {
    // given
    const { instructorUser, testSchool } = await testInstance.createSchoolData();
    const appointmentTypeDto = Testdata.createAppointmentTypeDto();

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/instructor/schools/${testSchool.id}/appointment-types`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(appointmentTypeDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.appointmentTypeRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toMatchSnapshot({
          id: expect.any(Number)
        });
      });
  });

  it('/instructor/schools/:id/appointment-types (PUT)', async () => {
    // given
    const { instructorUser, testSchool } = await testInstance.createSchoolData();
    const appointmentType = Testdata.createAppointmentType("appointment type");
    await testInstance.appointmentTypeRepository.save(appointmentType);
    const appointmentTypeDto = {
      ...Testdata.createAppointmentTypeDto(),
      name: "new name"
    };

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/instructor/schools/${testSchool.id}/appointment-types/${appointmentType.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(appointmentTypeDto)
      .expect(200)
      .then(async (response) => {
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.appointmentTypeRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toMatchSnapshot({
          id: expect.any(Number)
        });
      });
  });
});