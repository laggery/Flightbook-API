import { AuthFacade } from './auth.facade';
import { TestBed } from '@automock/jest';
import { UserRepository } from '../user/user.repository';
import { UserFacade } from '../user/user.facade';
import { AuthService } from './service/auth.service';
import { EmailService } from '../email/email.service';

describe('AuthFacade', () => {
  let provider: AuthFacade;
  let userRepository: jest.Mocked<UserRepository>,
      userFacade: jest.Mocked<UserFacade>,
      authService: jest.Mocked<AuthService>,
      emailService: jest.Mocked<EmailService>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(AuthFacade).compile();

    provider = unit;
    userRepository = unitRef.get(UserRepository);
    userFacade = unitRef.get(UserFacade);
    authService = unitRef.get(AuthService);
    emailService = unitRef.get(EmailService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
