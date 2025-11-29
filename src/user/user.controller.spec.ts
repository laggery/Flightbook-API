import { UserController } from './user.controller';
import { UserFacade } from './user.facade';

describe('User Controller', () => {
  let controller: UserController;
  let facade: jest.Mocked<UserFacade>;

  beforeAll(async () => {
    facade = {} as jest.Mocked<UserFacade>;
    controller = new UserController(facade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
