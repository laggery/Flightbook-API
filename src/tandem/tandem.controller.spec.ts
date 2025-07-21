import { Test, TestingModule } from '@nestjs/testing';
import { TandemController } from './tandem.controller';
import { PassengerConfirmationFacade } from './passenger-confirmation/passenger-confirmation.facade';
import { TestBed } from '@automock/jest';

describe('TandemController', () => {
  let controller: TandemController,
        passengerConfirmationFacade: jest.Mocked<PassengerConfirmationFacade>;
  
    beforeAll(async () => {
      const { unit, unitRef } = TestBed.create(TandemController).compile();
  
      controller = unit;
      passengerConfirmationFacade = unitRef.get(PassengerConfirmationFacade);
    });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
