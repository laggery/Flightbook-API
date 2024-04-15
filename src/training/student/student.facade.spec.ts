import { StudentFacade } from './student.facade';
import { AppointmentRepository } from '../appointment/appointment.repository';
import { FlightFacade } from '../../flight/flight.facade';
import { ControlSheetFacade } from '../control-sheet/control-sheet.facade';
import { StudentRepository } from './student.repository';
import { TestBed } from '@automock/jest';

describe('StudentFacade', () => {
  let facade: StudentFacade,
      appointmentRepository: jest.Mocked<AppointmentRepository>,
      flightFacade: jest.Mocked<FlightFacade>,
      controlSheetFacade: jest.Mocked<ControlSheetFacade>,
      studentRepository: jest.Mocked<StudentRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(StudentFacade).compile();

    facade = unit;
    appointmentRepository = unitRef.get(AppointmentRepository);
    flightFacade = unitRef.get(FlightFacade);
    controlSheetFacade = unitRef.get(ControlSheetFacade);
    studentRepository = unitRef.get(StudentRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
