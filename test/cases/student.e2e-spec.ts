import * as request from 'supertest';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';

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
});