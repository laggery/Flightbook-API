import { Test, TestingModule } from '@nestjs/testing';
import { PlaceRepository } from './place.repository';

describe('PlaceRepository', () => {
  let service: PlaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceRepository],
    }).compile();

    service = module.get<PlaceRepository>(PlaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
