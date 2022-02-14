import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentFacade } from './enrollment.facade';

describe('EnrollmentFacade', () => {
  let provider: EnrollmentFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentFacade],
    }).compile();

    provider = module.get<EnrollmentFacade>(EnrollmentFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
