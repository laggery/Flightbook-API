import { GliderFacade } from './glider.facade';
import { GliderRepository } from './glider.repository';
import { UserRepository } from '../user/user.repository';

describe('GliderFacade', () => {
  let provider: GliderFacade,
      gliderRepository: jest.Mocked<GliderRepository>,
      userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    gliderRepository = {} as any;
    userRepository = {} as any;
    provider = new GliderFacade(gliderRepository, userRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
