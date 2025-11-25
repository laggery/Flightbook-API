import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { EnrollmentType } from '../../src/training/enrollment/enrollment-type';
import { removeIds } from '../utils/snapshot-utils';

describe('Enrollments (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/:token (GET)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const enrollment = Testdata.createEnrollment(school, Testdata.EMAIL, EnrollmentType.TEAM_MEMBER);
    await testInstance.enrollmentRepository.save(enrollment);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/enrollments/${enrollment.token}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(removeIds(response.body)).toMatchSnapshot({
          expireAt: expect.any(String),
          token: expect.any(String)
        });

        const db = await testInstance.enrollmentRepository.findOne({
          where: { email: response.body.email }
        });
        expect(removeIds(db)).toMatchSnapshot({
          token: expect.any(String)
        });
      });
  });

  it('/:token Team member (POST)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const enrollment = Testdata.createEnrollment(school, Testdata.EMAIL, EnrollmentType.TEAM_MEMBER);
    await testInstance.enrollmentRepository.save(enrollment);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/enrollments/${enrollment.token}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async (response) => {
        const db = await testInstance.teamMemberRepository.findOne({
          relations: ['user', 'school'],
          where: {
            user: {
              id: Testdata.getDefaultUser().id
            }
          }
        });
        expect(removeIds(db)).toMatchSnapshot();
      });
  });

  it('/:token Student (POST)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const enrollment = Testdata.createEnrollment(school, Testdata.EMAIL, EnrollmentType.STUDENT);
    await testInstance.enrollmentRepository.save(enrollment);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/enrollments/${enrollment.token}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async (response) => {
        const db = await testInstance.studentRepository.findOne({
          relations: ['user', 'school'],
          where: {
            user: {
              id: Testdata.getDefaultUser().id
            }
          }
        });
        expect(removeIds(db)).toMatchSnapshot();
      });
  });
});

describe('Student controller enrollment (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('student/schools/:schoolId/enrollment/:token/free Not free (GET)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const enrollment = Testdata.createEnrollment(school, Testdata.EMAIL, EnrollmentType.STUDENT);
    await testInstance.enrollmentRepository.save(enrollment);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/student/schools/${school.id}/enrollment/${enrollment.token}/free`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(JSON.parse(response.text)).toBe(false);
      });
  });

  it('student/schools/:schoolId/enrollment/:token/free Free (GET)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const enrollment = Testdata.createEnrollment(school, Testdata.EMAIL, EnrollmentType.STUDENT);
    enrollment.isFree = true;
    await testInstance.enrollmentRepository.save(enrollment);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/student/schools/${school.id}/enrollment/${enrollment.token}/free`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(JSON.parse(response.text)).toBe(true);
      });
  });
});