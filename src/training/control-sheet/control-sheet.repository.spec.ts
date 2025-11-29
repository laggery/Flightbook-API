import { ControlSheetRepository } from './control-sheet.repository';
import { Repository } from 'typeorm';
import { ControlSheet } from './control-sheet.entity';

describe('ControlSheet Repository', () => {
  let controlSheetRepository: ControlSheetRepository;

  beforeAll(async () => {
    const repository = {} as Repository<ControlSheet>;
    controlSheetRepository = new ControlSheetRepository(repository);
  });

  it('should be defined', () => {
    expect(controlSheetRepository).toBeDefined();
  });
});
