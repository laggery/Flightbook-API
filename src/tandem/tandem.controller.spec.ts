import { TandemController } from './tandem.controller';
import { PassengerConfirmationFacade } from './passenger-confirmation/passenger-confirmation.facade';

describe('TandemController', () => {
  let controller: TandemController,
        passengerConfirmationFacade: jest.Mocked<PassengerConfirmationFacade>;
  
    beforeAll(async () => {
      passengerConfirmationFacade = {} as jest.Mocked<PassengerConfirmationFacade>;
      controller = new TandemController(passengerConfirmationFacade);
    });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
