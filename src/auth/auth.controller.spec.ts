import { AuthController } from './auth.controller';
import { AuthFacade } from './auth.facade';
import { TestBed } from '@automock/jest';

describe('Auth Controller', () => {
  let controller: AuthController;
  let authFacade: jest.Mocked<AuthFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();

    controller = unit;
    authFacade = unitRef.get(AuthFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
