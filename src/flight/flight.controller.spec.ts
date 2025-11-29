import { FlightController } from './flight.controller';
import { FlightFacade } from './flight.facade';

describe('Flight Controller', () => {
  let controller: FlightController;
  let facade: jest.Mocked<FlightFacade>;

  beforeAll(async () => {
    facade = {} as any;
    controller = new FlightController(facade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
