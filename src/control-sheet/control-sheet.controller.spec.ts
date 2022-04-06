import { Test, TestingModule } from '@nestjs/testing';
import { ControlSheetController } from './control-sheet.controller';

describe('ControlSheetController', () => {
  let controller: ControlSheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlSheetController],
    }).compile();

    controller = module.get<ControlSheetController>(ControlSheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
