import { Test, TestingModule } from '@nestjs/testing';
import { GliderController } from './glider.controller';

describe('Glider Controller', () => {
  let controller: GliderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GliderController],
    }).compile();

    controller = module.get<GliderController>(GliderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
