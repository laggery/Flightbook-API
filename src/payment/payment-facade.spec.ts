import { PaymentFacade } from './payment-facade';
import { UserRepository } from '../user/user.repository';
import { HttpService } from '@nestjs/axios';
import { EmailService } from '../email/email.service';
import { TestBed } from '@automock/jest';

describe('Payment Facade', () => {
  let facade: PaymentFacade,
      userRepository: jest.Mocked<UserRepository>,
      httpService: jest.Mocked<HttpService>,
      emailService: jest.Mocked<EmailService>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(PaymentFacade).compile();

    facade = unit;
    httpService = unitRef.get(HttpService);
    userRepository = unitRef.get(UserRepository);
    emailService = unitRef.get(EmailService);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
