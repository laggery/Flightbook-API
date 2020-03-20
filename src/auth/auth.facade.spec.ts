import { Test, TestingModule } from '@nestjs/testing';
import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  let provider: AuthFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthFacade],
    }).compile();

    provider = module.get<AuthFacade>(AuthFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
