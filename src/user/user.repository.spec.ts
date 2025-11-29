import { UserRepository } from './user.repository';
import { Repository } from 'typeorm';
import { User } from './domain/user.entity';

describe('User repository', () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    const repository = {} as Repository<User>;
    userRepository = new UserRepository(repository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });
});
