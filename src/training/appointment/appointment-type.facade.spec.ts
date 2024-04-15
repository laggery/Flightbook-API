import { UserRepository } from '../../user/user.repository';
import { TestBed } from '@automock/jest';
import { SchoolRepository } from '../school/school.repository';
import { AppointmentTypeRepository } from './appointment-type.repository';
import { AppointmentTypeFacade } from './appointment-type.facade';

describe('AppointmentFacade', () => {
  let facade: AppointmentTypeFacade,
      appointmentTypeRepository: jest.Mocked<AppointmentTypeRepository>,
      schoolRepository: jest.Mocked<SchoolRepository>,
      userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(AppointmentTypeFacade).compile();

    facade = unit;
    appointmentTypeRepository = unitRef.get(AppointmentTypeRepository);
    schoolRepository = unitRef.get(SchoolRepository);
    userRepository = unitRef.get(UserRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
