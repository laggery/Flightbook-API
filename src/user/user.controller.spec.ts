import { UserController } from './user.controller';
import { UserFacade } from './user.facade';
import { TestBed } from '@automock/jest';

describe('User Controller', () => {
  let controller: UserController;
  let facade: jest.Mocked<UserFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(UserController).compile();

    controller = unit;
    facade = unitRef.get(UserFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
