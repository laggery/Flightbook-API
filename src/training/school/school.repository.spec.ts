import { SchoolRepository } from './school.repository';
import { TestBed } from '@automock/jest';

describe('School Repository', () => {
  let schoolRepository: SchoolRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(SchoolRepository).compile();

    schoolRepository = unit;
  });

  it('should be defined', () => {
    expect(schoolRepository).toBeDefined();
  });
});
