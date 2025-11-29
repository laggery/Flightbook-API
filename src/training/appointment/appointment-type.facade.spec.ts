import { UserRepository } from '../../user/user.repository';
import { SchoolRepository } from '../school/school.repository';
import { AppointmentTypeRepository } from './appointment-type.repository';
import { AppointmentTypeFacade } from './appointment-type.facade';

describe('AppointmentFacade', () => {
  let facade: AppointmentTypeFacade,
      appointmentTypeRepository: jest.Mocked<AppointmentTypeRepository>,
      schoolRepository: jest.Mocked<SchoolRepository>,
      userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    appointmentTypeRepository = {} as any;
    schoolRepository = {} as any;
    userRepository = {} as any;
    facade = new AppointmentTypeFacade(appointmentTypeRepository, schoolRepository, userRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
