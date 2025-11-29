import { UserFacade } from './user.facade';
import { UserRepository } from './user.repository';
import { AuthService } from '../auth/service/auth.service';
import { PaymentFacade } from '../payment/payment-facade';
import { EmailService } from '../email/email.service';
import { KeycloakService } from '../auth/service/keycloak.service';

describe('User Facade', () => {
  let facade: UserFacade,
      userRepository: jest.Mocked<UserRepository>,
      authService: jest.Mocked<AuthService>,
      paymentFacade: jest.Mocked<PaymentFacade>,
      emailService: jest.Mocked<EmailService>,
      keycloakService: jest.Mocked<KeycloakService>;

  beforeAll(async () => {
    userRepository = {} as any;
    authService = {} as any;
    paymentFacade = {} as any;
    emailService = {} as any;
    keycloakService = {} as any;
    facade = new UserFacade(userRepository, authService, paymentFacade, emailService, keycloakService);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
