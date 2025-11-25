import * as request from 'supertest';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { removeIds } from '../utils/snapshot-utils';
import { Testdata } from '../testdata';
import { Subscription } from '../../src/training/subscription/subscription.entity';

describe('student appointment (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/student/schools/:id/appointments (GET)', async () => {
    // given
    const { studentUser, testSchool } = await testInstance.createSchoolDataWithAppointment();
    await testInstance.createSchoolDataWithAppointment('student2@student.com', 'instructor2@instructor.com', 'test school 2', 'appointment type 2');

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/student/schools/${testSchool.id}/appointments`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(4);
        expect(removeIds(response.body[0])).toMatchSnapshot();

        const db = await testInstance.appointmentRepository.find();
        expect(db).toHaveLength(8);
      });
  });

  it('/student/schools/:id/appointments/:appointmentId (GET)', async () => {
    // given
    const { studentUser, testSchool, appointments } = await testInstance.createSchoolDataWithAppointment();

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/student/schools/${testSchool.id}/appointments/${appointments[0].id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body.id).toEqual(appointments[0].id);
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/student/schools/:schoolId/appointments/:appointmentId/subscriptions (POST)', async () => {
    // given
    const { studentUser, student, testSchool, appointments } = await testInstance.createSchoolDataWithAppointment();

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/student/schools/${testSchool.id}/appointments/${appointments[0].id}/subscriptions`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(201)
      .then(async (response) => {
        expect(response.body.subscriptions).toHaveLength(1);
        expect(response.body.subscriptions[0].student.id).toEqual(student.id);
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/student/schools/:schoolId/appointments/:appointmentId/subscriptions waiting list (POST)', async () => {
    // given
    const { studentUser, student, testSchool, appointments } = await testInstance.createSchoolDataWithAppointment();
    const subscription = new Subscription();
    subscription.appointment = appointments[0];
    subscription.user = studentUser;
    await testInstance.subscriptionRepository.save(subscription);
    const studentUser2 = await testInstance.getDefaultUser();
    const student2 = Testdata.createStudent(studentUser2, testSchool);
    await testInstance.studentRepository.save(student2);

    const keycloakToken2 = JwtTestHelper.createKeycloakToken({ sub: studentUser2.id, email: studentUser2.email });

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/student/schools/${testSchool.id}/appointments/${appointments[0].id}/subscriptions`)
      .set('Authorization', `Bearer ${keycloakToken2}`)
      .expect(201)
      .then(async (response) => {
        expect(response.body.subscriptions).toHaveLength(2);
        expect(response.body.subscriptions[1].student.id).toEqual(student2.id);
        expect(response.body.subscriptions[1].waitingList).toBeTruthy();
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/student/schools/:schoolId/appointments/:appointmentId/subscriptions unauthorized (POST)', async () => {
    // given
    const { testSchool, appointments } = await testInstance.createSchoolDataWithAppointment();

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/student/schools/${testSchool.id}/appointments/${appointments[0].id}/subscriptions`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(401);
  });

  it('/student/schools/:schoolId/appointments/:appointmentId/subscriptions (DELETE)', async () => {
    // given
    const { studentUser, testSchool, appointments } = await testInstance.createSchoolDataWithAppointment();
    const subscription = new Subscription();
    subscription.appointment = appointments[0];
    subscription.user = studentUser;
    await testInstance.subscriptionRepository.save(subscription);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/student/schools/${testSchool.id}/appointments/${appointments[0].id}/subscriptions`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.appointmentRepository.findOne({
            relations: {
              subscriptions: true
            },
            where: {
              id: appointments[0].id
            }
          });
        expect(db.subscriptions).toHaveLength(0);
      });
  });

  it('/student/schools/:schoolId/appointments/:appointmentId/subscriptions badRequest (DELETE)', async () => {
    // given
    const { studentUser, testSchool, appointments } = await testInstance.createSchoolDataWithAppointment();

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/student/schools/${testSchool.id}/appointments/${appointments[0].id}/subscriptions`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(400)
      .then(async (response) => {
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/student/schools/:schoolId/appointments/:appointmentId/subscriptions unauthorized (DELETE)', async () => {
    // given
    const { studentUser, testSchool, appointments } = await testInstance.createSchoolDataWithAppointment();
    const subscription = new Subscription();
    subscription.appointment = appointments[0];
    subscription.user = studentUser;
    await testInstance.subscriptionRepository.save(subscription);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/student/schools/${testSchool.id}/appointments/${appointments[0].id}/subscriptions`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(401);
  });
});