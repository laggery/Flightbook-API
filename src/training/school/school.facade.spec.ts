import { SchoolFacade } from './school.facade';
import { UserRepository } from '../../user/user.repository';
import { SchoolRepository } from './school.repository';
import { TestBed } from '@automock/jest';

describe('SchoolFacade', () => {
  let facade: SchoolFacade,
      userRepository: jest.Mocked<UserRepository>,
      schoolRepository: jest.Mocked<SchoolRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(SchoolFacade).compile();

    facade = unit;
    userRepository = unitRef.get(UserRepository);
    schoolRepository = unitRef.get(SchoolRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
