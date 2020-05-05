import { Test, TestingModule } from '@nestjs/testing';
import { UserFacade } from './user.facade';

describe('UserFacade', () => {
  let provider: UserFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFacade],
    }).compile();

    provider = module.get<UserFacade>(UserFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
