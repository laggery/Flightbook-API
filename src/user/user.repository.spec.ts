import { UserRepository } from './user.repository';
import { TestBed } from '@automock/jest';

describe('User repository', () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(UserRepository).compile();

    userRepository = unit;
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });
});
