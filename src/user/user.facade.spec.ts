import { UserFacade } from './user.facade';
import { UserRepository } from './user.repository';
import { AuthService } from '../auth/auth.service';
import { PaymentFacade } from '../payment/payment-facade';
import { TestBed } from '@automock/jest';

describe('User Facade', () => {
  let facade: UserFacade,
      userRepository: jest.Mocked<UserRepository>,
      authService: jest.Mocked<AuthService>,
      paymentFacade: jest.Mocked<PaymentFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(UserFacade).compile();

    facade = unit;
    authService = unitRef.get(AuthService);
    userRepository = unitRef.get(UserRepository);
    paymentFacade = unitRef.get(PaymentFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
