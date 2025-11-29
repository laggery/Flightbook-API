import { GliderController } from './glider.controller';
import { GliderFacade } from './glider.facade';

describe('GliderController', () => {
  let controller: GliderController;
  let facade: jest.Mocked<GliderFacade>;

  beforeAll(async () => {
    facade = {} as jest.Mocked<GliderFacade>;
    controller = new GliderController(facade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
