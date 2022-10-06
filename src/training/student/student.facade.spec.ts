import { Test, TestingModule } from '@nestjs/testing';
import { StudentFacade } from './student.facade';

describe('StudentFacade', () => {
  let provider: StudentFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentFacade],
    }).compile();

    provider = module.get<StudentFacade>(StudentFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
