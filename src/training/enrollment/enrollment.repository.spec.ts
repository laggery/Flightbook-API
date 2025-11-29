import { EnrollmentRepository } from './enrollment.repository';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';

describe('Enrollment Repository', () => {
  let enrollmentRepository: EnrollmentRepository;

  beforeAll(async () => {
    const repository = {} as Repository<Enrollment>;
    enrollmentRepository = new EnrollmentRepository(repository);
  });

  it('should be defined', () => {
    expect(enrollmentRepository).toBeDefined();
  });
});
