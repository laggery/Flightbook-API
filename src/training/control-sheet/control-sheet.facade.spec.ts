import { Test, TestingModule } from '@nestjs/testing';
import { ControlSheetFacade } from './control-sheet.facade';

describe('ControlSheetFacade', () => {
  let provider: ControlSheetFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlSheetFacade],
    }).compile();

    provider = module.get<ControlSheetFacade>(ControlSheetFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
