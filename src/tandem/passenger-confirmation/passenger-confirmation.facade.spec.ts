import { PassengerConfirmationFacade } from './passenger-confirmation.facade';
import { PassengerConfirmationRepository } from './passenger-confirmation.repository';
import { UserRepository } from '../../user/user.repository';

describe('PassengerConfirmationFacade', () => {
  let facade: PassengerConfirmationFacade,
      passengerConfirmationRepository: jest.Mocked<PassengerConfirmationRepository>,
      userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    passengerConfirmationRepository = {} as any;
    userRepository = {} as any;
    facade = new PassengerConfirmationFacade(userRepository, passengerConfirmationRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});