import { Test, TestingModule } from '@nestjs/testing';
import { FlightFacade } from './flight.facade';

describe('FlightFacade', () => {
  let provider: FlightFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightFacade],
    }).compile();

    provider = module.get<FlightFacade>(FlightFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
