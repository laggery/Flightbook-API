import * as request from 'supertest';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { removeIds } from '../utils/snapshot-utils';

describe('instructor team members (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/instructor/schools/:id/team-members (GET)', async () => {
      // given
      const { instructorUser, testSchool } = await testInstance.createSchoolDataWithAppointment();
  
      const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });
  
      //when
      return request(testInstance.app.getHttpServer())
        .get(`/instructor/schools/${testSchool.id}/team-members`)
        .set('Authorization', `Bearer ${keycloakToken}`)
        .expect(200)
        .then(async (response) => {
          expect(response.body).toHaveLength(1);
          expect(removeIds(response.body)).toMatchSnapshot();
        });
    });

  it('/instructor/schools/:id/team-members/:teamMemberId (DELETE)', async () => {
    // given
    const { teamMember, instructorUser } = await testInstance.createSchoolData();
    teamMember.admin = false;
    await testInstance.teamMemberRepository.save(teamMember);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/instructor/schools/${teamMember.school.id}/team-members/${teamMember.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.teamMemberRepository.find();
        expect(db).toHaveLength(0);
      });
  });

  it('/instructor/schools/:id/team-members/:teamMemberId unauthorized (DELETE)', async () => {
    // given
    const { teamMember, instructorUser } = await testInstance.createSchoolData();

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/instructor/schools/${teamMember.school.id}/team-members/${teamMember.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(401)
      .then(async () => {
        const db = await testInstance.teamMemberRepository.find();
        expect(db).toHaveLength(1);
      });
  });
});