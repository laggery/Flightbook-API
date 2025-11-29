import { EnrollmentFacade } from '../enrollment/enrollment.facade';
import { StudentController } from './student.controller';
import { StudentFacade } from '../student/student.facade';
import { AppointmentFacade } from '../appointment/appointment.facade';
import { TeamMemberFacade } from '../team-member/team-member.facade';
import { ControlSheetFacade } from '../control-sheet/control-sheet.facade';
import { EmergencyContactFacade } from '../emergency-contact/emergency-contact.facade';

describe('Student Controller', () => {
  let controller: StudentController,
      studentFacade: jest.Mocked<StudentFacade>,
      controlSheetFacade: jest.Mocked<ControlSheetFacade>,
      teamMembersFacade: jest.Mocked<TeamMemberFacade>,
      enrollmentFacade: jest.Mocked<EnrollmentFacade>,
      appointmentFacade: jest.Mocked<AppointmentFacade>,
      emergencyContactFacade: jest.Mocked<EmergencyContactFacade>;

  beforeAll(async () => {
    studentFacade = {} as any;
    appointmentFacade = {} as any;
    controlSheetFacade = {} as any;
    teamMembersFacade = {} as any;
    enrollmentFacade = {} as any;
    emergencyContactFacade = {} as any;
    controller = new StudentController(
      studentFacade,
      appointmentFacade,
      controlSheetFacade,
      teamMembersFacade,
      enrollmentFacade,
      emergencyContactFacade
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
