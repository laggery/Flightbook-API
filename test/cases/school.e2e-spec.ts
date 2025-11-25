import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { SchoolDto } from '../../src/training/school/interface/school-dto';
import { plainToClass } from 'class-transformer';
import { removeIds } from '../utils/snapshot-utils';

describe('Schools (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/schools (POST)', async () => {
    // given
    const schoolDto = Testdata.createSchoolDto("School 1");
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/schools')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(schoolDto)
      .expect(201)
      .then(async (response) => {
        await assertSchool(testInstance, response.body, schoolDto);
      });
  });

  it('/schools already exists (POST)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/schools')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(Testdata.createSchoolDto("School 1"))
      .expect(409)
      .then(async (response) => {
        expect(response.body.message).toEqual('The school already exists.');
      });
  });

  it('/schools/configuration (PUT)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();
    expect(school.configuration).toEqual({
      validateFlights: true,
      userCanEditControlSheet: true
    });

    school.configuration = {
      validateFlights: false,
      userCanEditControlSheet: false
    };

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/schools/${school.id}/configuration`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(school.configuration)
      .expect(200)
      .then(async (response) => {
        await assertSchool(testInstance, response.body, plainToClass(SchoolDto, school));
      });
  });
});

describe('Student schools (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/student/schools (GET)', async () => {
    // given
    const { studentUser } = await testInstance.createSchoolData();
    
    // Create a second school
    await testInstance.createSchoolData("student2@student.com", "instructor2@instructor.com", "School 2");
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/student/schools`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(1);
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.schoolRepository.find();

        expect(db).toHaveLength(2);
      });
  });
});

async function assertSchool(testInstance: any, received: any, expected: SchoolDto) {
  expect(removeIds(received)).toMatchSnapshot();
  expect(received.id).toBeDefined();

  const db = await testInstance.schoolRepository.findOne({
    where: { name: received.name }
  });
  expect(removeIds(db)).toMatchSnapshot();
  expect(db.id).toEqual(received.id);
}