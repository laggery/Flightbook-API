import { Test, TestingModule } from '@nestjs/testing';
import { ControlSheetService } from './control-sheet.service';

describe('ControlSheetService', () => {
  let service: ControlSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlSheetService],
    }).compile();

    service = module.get<ControlSheetService>(ControlSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
