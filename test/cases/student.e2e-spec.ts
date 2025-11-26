import * as request from 'supertest';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { Subscription } from '../../src/training/subscription/subscription.entity';
import { removeIds } from '../utils/snapshot-utils';

describe('instructor student (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/instructor/students/:id/tandem (PUT)', async () => {
    // given
    const { student, instructorUser } = await testInstance.createSchoolData();
    expect(student.isTandem).toBe(false);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/instructor/students/${student.id}/tandem`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body.isTandem).toBe(true);

        const db = await testInstance.studentRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db.isTandem).toBe(true);
      });
  });

  it('/instructor/students/:id (DELETE)', async () => {
    // given
    const { student, instructorUser } = await testInstance.createSchoolData();
    expect(student.isArchived).toBe(false);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/instructor/students/${student.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.studentRepository.findOne({
          where: { id: student.id }
        });
        expect(db.isArchived).toBe(true);
      });
  });

  it('/instructor/schools/:id/students (GET)', async () => {
    // given
    const { instructorUser, testSchool } = await testInstance.createSchoolDataWithAppointment();

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/instructor/schools/${testSchool.id}/students`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(1);
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/instructor/schools/:id/appointments/:appointment_id/students (GET)', async () => {
    // given
    const { studentUser, instructorUser, testSchool, appointments } = await testInstance.createSchoolDataWithAppointment();
    const subscription = new Subscription();
    subscription.user = studentUser;
    subscription.appointment = appointments[0];
    await testInstance.subscriptionRepository.save(subscription);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/instructor/schools/${testSchool.id}/appointments/${appointments[0].id}/students`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(1);
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });
});