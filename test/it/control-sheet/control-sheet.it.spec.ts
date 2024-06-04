import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbTestConfig } from '../db-test-config';
import { TestUtil } from '../../test.util';
import { ControlSheetRepository } from '../../../src/training/control-sheet/control-sheet.repository';
import { ControlSheetModule } from '../../../src/training/control-sheet/control-sheet.module';

describe('ControlSheetRepository', () => {
  let controlSheetRepository: ControlSheetRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbTestConfig),
        ControlSheetModule
      ]
    })
      .compile();
    moduleRef.useLogger(new Logger());
    controlSheetRepository = moduleRef.get(ControlSheetRepository);
  });

  beforeEach(async () => {
    controlSheetRepository.clear();
  });

  it('Should get control sheet', async () => {
    // given
    const controlSheet = TestUtil.createControlSheet(true);

    await controlSheetRepository.save(controlSheet);

    //when
    const resp = await controlSheetRepository.getControlSheetByUserId(1);

    //then
    expect(resp).toBeDefined();
    let keys = Object.keys(resp.trainingHill);
    keys.forEach((key) => {
      expect(resp.trainingHill[key]).toEqual(controlSheet.trainingHill[key]);
    });

    keys = Object.keys(resp.altitudeFlight);
    keys.forEach((key) => {
      expect(resp.altitudeFlight[key]).toEqual(controlSheet.altitudeFlight[key]);
    });

    keys = Object.keys(resp.theory);
    keys.forEach((key) => {
      expect(resp.theory[key]).toEqual(controlSheet.theory[key]);
    });

    keys = Object.keys(resp.level);
    keys.forEach((key) => {
      expect(resp.level[key]).toEqual(controlSheet.level[key]);
    });
  });

  it('Should not found control sheet', async () => {
    // given

    //when
    const resp = await controlSheetRepository.getControlSheetByUserId(1);

    //then
    expect(resp).toBeNull();
  });
});
