import { StudentFacade } from './student.facade';
import { AppointmentRepository } from '../appointment/appointment.repository';
import { FlightFacade } from '../../flight/flight.facade';
import { ControlSheetFacade } from '../control-sheet/control-sheet.facade';
import { StudentRepository } from './student.repository';
import { SchoolRepository } from '../school/school.repository';
import { NoteRepository } from '../note/note.repository';
import { EmergencyContactFacade } from '../emergency-contact/emergency-contact.facade';

describe('StudentFacade', () => {
  let facade: StudentFacade,
      appointmentRepository: jest.Mocked<AppointmentRepository>,
      flightFacade: jest.Mocked<FlightFacade>,
      controlSheetFacade: jest.Mocked<ControlSheetFacade>,
      studentRepository: jest.Mocked<StudentRepository>,
      schoolRepository: jest.Mocked<SchoolRepository>,
      noteRepository: jest.Mocked<NoteRepository>,
      emergencyContactFacade: jest.Mocked<EmergencyContactFacade>;

  beforeAll(async () => {
    studentRepository = {} as any;
    schoolRepository = {} as any;
    appointmentRepository = {} as any;
    noteRepository = {} as any;
    flightFacade = {} as any;
    controlSheetFacade = {} as any;
    emergencyContactFacade = {} as any;
    facade = new StudentFacade(studentRepository, schoolRepository, appointmentRepository, noteRepository, flightFacade, controlSheetFacade, emergencyContactFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
