import { EnrollmentRepository } from './enrollment.repository';
import { TestBed } from '@automock/jest';

describe('Enrollment Repository', () => {
  let enrollmentRepository: EnrollmentRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(EnrollmentRepository).compile();

    enrollmentRepository = unit;
  });

  it('should be defined', () => {
    expect(enrollmentRepository).toBeDefined();
  });
});
