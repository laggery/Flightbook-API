import { FlightRepository } from './flight.repository';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';

describe('Flight Repository', () => {
  let flightRepository: FlightRepository;

  beforeAll(async () => {
    const repository = {} as Repository<Flight>;
    flightRepository = new FlightRepository(repository);
  });

  it('should be defined', () => {
    expect(flightRepository).toBeDefined();
  });
});
