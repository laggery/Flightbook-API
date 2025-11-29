import { PlaceController } from './place.controller';
import { PlaceFacade } from './place.facade';

describe('Place Controller', () => {
  let controller: PlaceController;
  let facade: jest.Mocked<PlaceFacade>;

  beforeAll(async () => {
    facade = {} as jest.Mocked<PlaceFacade>;
    controller = new PlaceController(facade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
