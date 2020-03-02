import { Test, TestingModule } from '@nestjs/testing';
import { PlaceFacade } from './place.facade';

describe('PlaceFacade', () => {
  let provider: PlaceFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceFacade],
    }).compile();

    provider = module.get<PlaceFacade>(PlaceFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
