import { ControlSheetRepository } from './control-sheet.repository';
import { TestBed } from '@automock/jest';

describe('ControlSheet Repository', () => {
  let controlSheetRepository: ControlSheetRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(ControlSheetRepository).compile();

    controlSheetRepository = unit;
  });

  it('should be defined', () => {
    expect(controlSheetRepository).toBeDefined();
  });
});
