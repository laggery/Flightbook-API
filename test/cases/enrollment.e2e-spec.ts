import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { EnrollmentType } from '../../src/training/enrollment/enrollment-type';

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
        expect(response.body).toBeDefined();
        expect(response.body).toEqual({
          email: Testdata.EMAIL,
          token: enrollment.token,
          expireAt: enrollment.expireAt.toISOString(),
          type: EnrollmentType.TEAM_MEMBER,
          school: {
            id: expect.any(Number),
            name: school.name,
            address1: school.address1,
            address2: school.address2,
            plz: school.plz,
            city: school.city,
            phone: school.phone,
            email: school.email,
            language: school.language,
            configuration: school.configuration
          },
          isUser: true
        });

        const db = await testInstance.enrollmentRepository.findOne({
          where: { email: response.body.email }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: enrollment.id,
          email: Testdata.EMAIL,
          token: enrollment.token,
          expireAt: enrollment.expireAt,
          type: EnrollmentType.TEAM_MEMBER,
          isFree: false
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
          where: { user: {
            id: Testdata.getDefaultUser().id
          } }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: expect.any(Number),
          admin: false,
          school: {
            id: school.id
          },
          user: {
            id: Testdata.getDefaultUser().id,
            email: Testdata.EMAIL
          }
        });
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
          where: { user: {
            id: Testdata.getDefaultUser().id
          } }
        });
        expect(db).toBeDefined();
        expect(db).toMatchObject({
          id: expect.any(Number),
          isArchived: false,
          isTandem: false,
          school: {
            id: school.id
          },
          user: {
            id: Testdata.getDefaultUser().id,
            email: Testdata.EMAIL
          }
        });
      });
  });
});