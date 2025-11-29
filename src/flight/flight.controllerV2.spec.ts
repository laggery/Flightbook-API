import { FlightControllerV2 } from './flight.controllerV2';
import { FlightFacade } from './flight.facade';

describe('Flight Controller V2', () => {
  let controller: FlightControllerV2;
  let facade: jest.Mocked<FlightFacade>;

  beforeAll(async () => {
    facade = {} as any;
    controller = new FlightControllerV2(facade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
