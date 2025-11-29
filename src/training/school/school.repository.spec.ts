import { SchoolRepository } from './school.repository';
import { Repository } from 'typeorm';
import { School } from './school.entity';

describe('School Repository', () => {
  let schoolRepository: SchoolRepository;

  beforeAll(async () => {
    const repository = {} as Repository<School>;
    schoolRepository = new SchoolRepository(repository);
  });

  it('should be defined', () => {
    expect(schoolRepository).toBeDefined();
  });
});
