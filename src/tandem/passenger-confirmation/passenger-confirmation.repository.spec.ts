import { TestBed } from '@automock/jest';
import { PassengerConfirmationRepository } from './passenger-confirmation.repository';

describe('PassengerConfirmation Repository', () => {
  let passengerConfirmationRepository: PassengerConfirmationRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(PassengerConfirmationRepository).compile();

    passengerConfirmationRepository = unit;
  });

  it('should be defined', () => {
    expect(passengerConfirmationRepository).toBeDefined();
  });
});
