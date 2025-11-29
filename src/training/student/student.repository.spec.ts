import { StudentRepository } from './student.repository';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

describe('Student Repository', () => {
  let studentRepository: StudentRepository;

  beforeAll(async () => {
    const repository = {} as Repository<Student>;
    studentRepository = new StudentRepository(repository);
  });

  it('should be defined', () => {
    expect(studentRepository).toBeDefined();
  });
});
