import { Test, TestingModule } from '@nestjs/testing';
import { StudentRepository } from './student.repository';

describe('StudentService', () => {
  let service: StudentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentRepository],
    }).compile();

    service = module.get<StudentRepository>(StudentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
