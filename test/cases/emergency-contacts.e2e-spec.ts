import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { removeIds } from '../utils/snapshot-utils';

describe('instructor emergency contacts (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/instructor/students/:id/emergency-contacts (GET)', async () => {
    // given
    const { student, studentUser, instructorUser } = await testInstance.createSchoolData();
    const emergencyContact = Testdata.createEmergencyContact(studentUser);
    await testInstance.emergencyContactRepository.save(emergencyContact);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/instructor/students/${student.id}/emergency-contacts`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });
});

describe('student emergency contacts (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/student/emergency-contacts (GET)', async () => {
    // given
    const { student, studentUser, instructorUser } = await testInstance.createSchoolData();
    const emergencyContact = Testdata.createEmergencyContact(studentUser);
    await testInstance.emergencyContactRepository.save(emergencyContact);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/student/emergency-contacts`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/student/emergency-contacts (POST)', async () => {
    // given
    const { student, studentUser, instructorUser } = await testInstance.createSchoolData();
    const emergencyContactDto = Testdata.createEmergencyContactDto(studentUser);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    await request(testInstance.app.getHttpServer())
      .post(`/student/emergency-contacts`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(emergencyContactDto)
      .expect(201)
      .then(async (response) => {
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.emergencyContactRepository.findOne({
          where: { id: response.body.id }
        });
        expect(removeIds(db)).toMatchSnapshot();
      });

    // when
    emergencyContactDto.firstname = "emergency firstname 2";
    await request(testInstance.app.getHttpServer())
      .post(`/student/emergency-contacts`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(emergencyContactDto)
      .expect(201)
      .then(async (response) => {
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.emergencyContactRepository.findOne({
          where: { id: response.body.id }
        });
        expect(removeIds(db)).toMatchSnapshot();
      });
  });
});