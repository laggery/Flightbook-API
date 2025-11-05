import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { ControlSheet } from '../../src/training/control-sheet/control-sheet.entity';

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
        expect(response.body).toBeDefined();

        let keys = Object.keys(response.body.trainingHill);
        keys.forEach((key) => {
          expect(response.body.trainingHill[key]).toEqual(controlSheet.trainingHill[key]);
        });

        keys = Object.keys(response.body.altitudeFlight);
        keys.forEach((key) => {
          expect(response.body.altitudeFlight[key]).toEqual(controlSheet.altitudeFlight[key]);
        });

        keys = Object.keys(response.body.theory);
        keys.forEach((key) => {
          expect(response.body.theory[key]).toEqual(controlSheet.theory[key]);
        });

        keys = Object.keys(response.body.level);
        keys.forEach((key) => {
          expect(response.body.level[key]).toEqual(controlSheet.level[key]);
        });
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
        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.trainingHill.aufziehen).toEqual(controlSheet.trainingHill.aufziehen);

        const db = await testInstance.controlSheetRepository.findOne({
            where: { id: response.body.id },
            relations: ['trainingHill', 'altitudeFlight', 'theory', 'level', 'user']
        });

        expect(db).toBeDefined();
        expect(db.trainingHill.aufziehen).toEqual(controlSheet.trainingHill.aufziehen);
      });
  });
});

describe('Instructor ControlSheet (e2e)', () => {
});
