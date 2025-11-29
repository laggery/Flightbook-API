import { AuthFacade } from './auth.facade';
import { UserRepository } from '../user/user.repository';
import { UserFacade } from '../user/user.facade';
import { AuthService } from './service/auth.service';
import { EmailService } from '../email/email.service';
import { KeycloakService } from './service/keycloak.service';

describe('AuthFacade', () => {
  let provider: AuthFacade;
  let userRepository: jest.Mocked<UserRepository>,
      userFacade: jest.Mocked<UserFacade>,
      authService: jest.Mocked<AuthService>,
      emailService: jest.Mocked<EmailService>,
      keycloakService: jest.Mocked<KeycloakService>;

  beforeAll(async () => {
    userRepository = {} as any;
    userFacade = {} as any;
    authService = {} as any;
    emailService = {} as any;
    keycloakService = {} as any;
    provider = new AuthFacade(userRepository, userFacade, authService, emailService, keycloakService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
