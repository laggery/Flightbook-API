import { EnrollmentFacade } from '../enrollment/enrollment.facade';
import { InstructorController } from './instructor.controller';
import { StudentFacade } from '../student/student.facade';
import { SchoolFacade } from '../school/school.facade';
import { TeamMemberFacade } from '../team-member/team-member.facade';
import { AppointmentFacade } from '../appointment/appointment.facade';
import { AppointmentTypeFacade } from '../appointment/appointment-type.facade';
import { NoteFacade } from '../note/note.facade';

describe('Instructor Controller', () => {
  let controller: InstructorController,
      studentFacade: jest.Mocked<StudentFacade>,
      teamMembersFacade: jest.Mocked<TeamMemberFacade>,
      enrollmentFacade: jest.Mocked<EnrollmentFacade>,
      appointmentFacade: jest.Mocked<AppointmentFacade>,
      appointmentTypeFacade: jest.Mocked<AppointmentTypeFacade>,
      noteFacade: jest.Mocked<NoteFacade>;

  beforeAll(async () => {
    studentFacade = {} as any;
    teamMembersFacade = {} as any;
    enrollmentFacade = {} as any;
    appointmentFacade = {} as any;
    appointmentTypeFacade = {} as any;
    noteFacade = {} as any;
    controller = new InstructorController(
      studentFacade,
      teamMembersFacade,
      enrollmentFacade,
      appointmentFacade,
      appointmentTypeFacade,
      noteFacade
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
