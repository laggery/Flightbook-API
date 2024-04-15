import { FlightController } from './flight.controller';
import { FlightFacade } from './flight.facade';
import { TestBed } from '@automock/jest';

describe('Flight Controller', () => {
  let controller: FlightController;
  let facade: jest.Mocked<FlightFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(FlightController).compile();

    controller = unit;
    facade = unitRef.get(FlightFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
