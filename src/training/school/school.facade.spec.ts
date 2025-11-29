import { SchoolFacade } from './school.facade';
import { UserRepository } from '../../user/user.repository';
import { SchoolRepository } from './school.repository';

describe('SchoolFacade', () => {
  let facade: SchoolFacade,
      userRepository: jest.Mocked<UserRepository>,
      schoolRepository: jest.Mocked<SchoolRepository>;

  beforeAll(async () => {
    userRepository = {} as any;
    schoolRepository = {} as any;
    facade = new SchoolFacade(schoolRepository, userRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
