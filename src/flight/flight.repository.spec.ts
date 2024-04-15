import { FlightRepository } from './flight.repository';
import { TestBed } from '@automock/jest';

describe('Flight Repository', () => {
  let flightRepository: FlightRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(FlightRepository).compile();

    flightRepository = unit;
  });

  it('should be defined', () => {
    expect(flightRepository).toBeDefined();
  });
});
