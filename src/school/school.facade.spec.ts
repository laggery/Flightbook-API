import { Test, TestingModule } from '@nestjs/testing';
import { SchoolFacade } from './school.facade';

describe('SchoolFacade', () => {
  let provider: SchoolFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolFacade],
    }).compile();

    provider = module.get<SchoolFacade>(SchoolFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
