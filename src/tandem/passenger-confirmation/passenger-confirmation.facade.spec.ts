import { PassengerConfirmationFacade } from './passenger-confirmation.facade';
import { PassengerConfirmationRepository } from './passenger-confirmation.repository';
import { UserRepository } from '../../user/user.repository';
import { TestBed } from '@automock/jest';

describe('PassengerConfirmationFacade', () => {
  let facade: PassengerConfirmationFacade,
      passengerConfirmationRepository: jest.Mocked<PassengerConfirmationRepository>,
      userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(PassengerConfirmationFacade).compile();

    facade = unit;
    passengerConfirmationRepository = unitRef.get(PassengerConfirmationRepository);
    userRepository = unitRef.get(UserRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});