import { ControlSheetFacade } from './control-sheet.facade';
import { ControlSheetRepository } from './control-sheet.repository';
import { UserRepository } from '../../user/user.repository';
import { TestBed } from '@automock/jest';
import { Testdata } from '../../../test/testdata';
import { ControlSheet } from './control-sheet.entity';
import { ControlSheetDto } from './interface/control-sheet-dto';
import { plainToClass } from 'class-transformer';
import { ForbiddenException } from '@nestjs/common';

describe('ControlSheetFacade', () => {
  let facade: ControlSheetFacade,
      controlSheetRepository: jest.Mocked<ControlSheetRepository>,
      userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ControlSheetFacade).compile();

    facade = unit;
    controlSheetRepository = unitRef.get(ControlSheetRepository);
    userRepository = unitRef.get(UserRepository);
  });

  it('Should get control sheet', async () => {
    // given
    const mockControlSheet = new ControlSheet();
    controlSheetRepository.getControlSheetByUserId.mockResolvedValue(mockControlSheet);

    // when
    const controlSheet = await facade.getControlSheet(Testdata.token);

    // then
    expect(controlSheetRepository.getControlSheetByUserId).toHaveBeenCalled();
    let keys = Object.keys(controlSheet.trainingHill);
    keys.forEach((key) => {
      expect(controlSheet.trainingHill[key]).toEqual(mockControlSheet.trainingHill[key]);
    });

    keys = Object.keys(controlSheet.altitudeFlight);
    keys.forEach((key) => {
      expect(controlSheet.altitudeFlight[key]).toEqual(mockControlSheet.altitudeFlight[key]);
    });

    keys = Object.keys(controlSheet.theory);
    keys.forEach((key) => {
      expect(controlSheet.theory[key]).toEqual(mockControlSheet.theory[key]);
    });

    keys = Object.keys(controlSheet.level);
    keys.forEach((key) => {
      expect(controlSheet.level[key]).toEqual(mockControlSheet.level[key]);
    });
  });

  it('Student should not be able to edit control sheet', async () => {
    // given
    const mockControlSheet = Testdata.createControlSheet(false);
    controlSheetRepository.getControlSheetByUserId.mockResolvedValue(mockControlSheet);

    const controlSheetDto = plainToClass(ControlSheetDto, mockControlSheet);

    // when
    const exception = async() => {
      await facade.studentCreateUpdateControlSheet(Testdata.token, controlSheetDto);
    }

    // then
    expect(exception).rejects.toThrow(ForbiddenException);
    expect(controlSheetRepository.getControlSheetByUserId).toHaveBeenCalled();
    expect(controlSheetRepository.save).toHaveBeenCalledTimes(0);
  });

  it('Student should be able to edit control sheet', async () => {
    // given
    const mockControlSheet = Testdata.createControlSheet(true);
    controlSheetRepository.getControlSheetByUserId.mockResolvedValue(mockControlSheet);
    const mockUser = Testdata.createUser();
    userRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));

    const controlSheetDto = plainToClass(ControlSheetDto, mockControlSheet);

    // when
    await facade.studentCreateUpdateControlSheet(Testdata.token, controlSheetDto);

    // then
    expect(controlSheetRepository.getControlSheetByUserId).toHaveBeenCalledTimes(2);
    expect(controlSheetRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Instructor should be able to edit control sheet', async () => {
    // given
    const mockControlSheet = Testdata.createControlSheet(false);
    controlSheetRepository.getControlSheetByUserId.mockResolvedValue(mockControlSheet);
    const mockUser = Testdata.createUser();
    userRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));

    const controlSheetDto = plainToClass(ControlSheetDto, mockControlSheet);

    // when
    await facade.instructorCreateUpdateControlSheet(Testdata.token, controlSheetDto);

    // then
    expect(controlSheetRepository.getControlSheetByUserId).toHaveBeenCalledTimes(1);
    expect(controlSheetRepository.save).toHaveBeenCalledTimes(1);
  });
});
