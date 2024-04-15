import { GliderFacade } from './glider.facade';
import { GliderRepository } from './glider.repository';
import { UserRepository } from '../user/user.repository';
import { TestBed } from '@automock/jest';

describe('GliderFacade', () => {
  let provider: GliderFacade,
      gliderRepository: jest.Mocked<GliderRepository>,
      userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(GliderFacade).compile();

    provider = unit;
    gliderRepository = unitRef.get(GliderRepository);
    userRepository = unitRef.get(UserRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
