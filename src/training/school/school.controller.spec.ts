import { SchoolController } from './school.controller';
import { SchoolFacade } from './school.facade';

describe('SchoolController', () => {
  let controller: SchoolController;
  let facade: jest.Mocked<SchoolFacade>;

  beforeAll(async () => {
    facade = {} as any;
    controller = new SchoolController(facade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
