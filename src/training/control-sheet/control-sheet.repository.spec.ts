import { Test, TestingModule } from '@nestjs/testing';
import { ControlSheetRepository } from './control-sheet.repository';

describe('ControlSheetService', () => {
  let service: ControlSheetRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlSheetRepository],
    }).compile();

    service = module.get<ControlSheetRepository>(ControlSheetRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
