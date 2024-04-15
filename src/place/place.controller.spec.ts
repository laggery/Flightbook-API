import { PlaceController } from './place.controller';
import { PlaceFacade } from './place.facade';
import { TestBed } from '@automock/jest';

describe('Place Controller', () => {
  let controller: PlaceController;
  let facade: jest.Mocked<PlaceFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(PlaceController).compile();

    controller = unit;
    facade = unitRef.get(PlaceFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
