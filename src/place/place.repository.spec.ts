import { PlaceRepository } from './place.repository';
import { TestBed } from '@automock/jest';

describe('PlaceRepository', () => {
  let placeRepository: PlaceRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(PlaceRepository).compile();

    placeRepository = unit;
  });

  it('should be defined', () => {
    expect(placeRepository).toBeDefined();
  });
});
