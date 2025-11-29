import { PassengerConfirmationRepository } from './passenger-confirmation.repository';
import { Repository } from 'typeorm';
import { PassengerConfirmation } from './passenger-confirmation.entity';

describe('PassengerConfirmation Repository', () => {
  let passengerConfirmationRepository: PassengerConfirmationRepository;

  beforeAll(async () => {
    const repository = {} as Repository<PassengerConfirmation>;
    passengerConfirmationRepository = new PassengerConfirmationRepository(repository);
  });

  it('should be defined', () => {
    expect(passengerConfirmationRepository).toBeDefined();
  });
});
