import { StudentRepository } from './student.repository';
import { TestBed } from '@automock/jest';

describe('Student Repository', () => {
  let studentRepository: StudentRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(StudentRepository).compile();

    studentRepository = unit;
  });

  it('should be defined', () => {
    expect(studentRepository).toBeDefined();
  });
});
