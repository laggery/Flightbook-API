import { FlightControllerV2 } from './flight.controllerV2';
import { FlightFacade } from './flight.facade';
import { TestBed } from '@automock/jest';

describe('Flight Controller V2', () => {
  let controller: FlightControllerV2;
  let facade: jest.Mocked<FlightFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(FlightControllerV2).compile();

    controller = unit;
    facade = unitRef.get(FlightFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
