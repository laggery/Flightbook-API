import { ControlSheetFacade } from './control-sheet.facade';
import { ControlSheetRepository } from './control-sheet.repository';
import { UserRepository } from '../../user/user.repository';
import { TestBed } from '@automock/jest';

describe('ControlSheetFacade', () => {
  let facade: ControlSheetFacade,
      controlSheetRepository: jest.Mocked<ControlSheetRepository>,
      userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(ControlSheetFacade).compile();

    facade = unit;
    controlSheetRepository = unitRef.get(ControlSheetRepository);
    userRepository = unitRef.get(UserRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
