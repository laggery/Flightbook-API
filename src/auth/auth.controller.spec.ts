import { AuthController } from './auth.controller';
import { AuthFacade } from './auth.facade';

describe('Auth Controller', () => {
  let controller: AuthController;
  let authFacade: jest.Mocked<AuthFacade>;

  beforeAll(async () => {
    authFacade = {} as any;
    controller = new AuthController(authFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
