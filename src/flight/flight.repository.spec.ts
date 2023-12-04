import { Test, TestingModule } from '@nestjs/testing';
import { FlightRepository } from './flight.repository';

describe('FlightService', () => {
  let service: FlightRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightRepository],
    }).compile();

    service = module.get<FlightRepository>(FlightRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
