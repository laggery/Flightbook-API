import { PlaceRepository } from './place.repository';
import { Repository } from 'typeorm';
import { Place } from './place.entity';

describe('PlaceRepository', () => {
  let placeRepository: PlaceRepository;

  beforeAll(async () => {
    const repository = {} as Repository<Place>;
    placeRepository = new PlaceRepository(repository);
  });

  it('should be defined', () => {
    expect(placeRepository).toBeDefined();
  });
});
