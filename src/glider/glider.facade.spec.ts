import { Test, TestingModule } from '@nestjs/testing';
import { GliderFacade } from './glider.facade';

describe('GliderFacade', () => {
  let provider: GliderFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GliderFacade],
    }).compile();

    provider = module.get<GliderFacade>(GliderFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
