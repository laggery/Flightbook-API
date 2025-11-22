import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { ControlSheet } from '../../src/training/control-sheet/control-sheet.entity';
import { removeIds } from '../utils/snapshot-utils';

describe('Student ControlSheet (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/student/control-sheet (GET)', async() => {
    // given
    const controlSheet = Testdata.createControlSheet(true);
    await testInstance.controlSheetRepository.save(controlSheet);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get('/student/control-sheet')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/student/control-sheet (POST)', async() => {
    // given
    const controlSheet = new ControlSheet();
    controlSheet.trainingHill.aufziehen = 2;
    await testInstance.controlSheetRepository.save(controlSheet);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/student/control-sheet')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(controlSheet)
      .expect(201)
      .then(async (response) => {
        expect(removeIds(response.body)).toMatchSnapshot();
        expect(response.body.id).toBeDefined();

        const db = await testInstance.controlSheetRepository.findOne({
            where: { id: response.body.id },
            relations: ['trainingHill', 'altitudeFlight', 'theory', 'level', 'user']
        });
        expect(removeIds(db)).toMatchSnapshot();
        expect(db.id).toEqual(response.body.id);
      });
  });
});

describe('Instructor ControlSheet (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/instructor/students/:id/control-sheet (GET)', async() => {
    // given
    const { student, instructorUser } = await testInstance.createSchoolData();
    const controlSheet = Testdata.createControlSheet(true);
    await testInstance.controlSheetRepository.save(controlSheet);
    
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/instructor/students/${student.id}/control-sheet`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/instructor/student/:id/control-sheet (POST)', async() => {
    // given
    const { student, instructorUser } = await testInstance.createSchoolData();
    const controlSheet = new ControlSheet();
    controlSheet.trainingHill.aufziehen = 2;
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/instructor/students/${student.id}/control-sheet`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(controlSheet)
      .expect(201)
      .then(async (response) => {
        expect(removeIds(response.body)).toMatchSnapshot();
        expect(response.body.id).toBeDefined();

        const db = await testInstance.controlSheetRepository.findOne({
            where: { id: response.body.id },
            relations: ['trainingHill', 'altitudeFlight', 'theory', 'level', 'user']
        });
        expect(removeIds(db)).toMatchSnapshot();
        expect(db.id).toEqual(response.body.id);
      });
  });
});
