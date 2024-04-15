import { EnrollmentFacade } from '../enrollment/enrollment.facade';
import { TestBed } from '@automock/jest';
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
      schoolFacade: jest.Mocked<SchoolFacade>,
      teamMembersFacade: jest.Mocked<TeamMemberFacade>,
      enrollmentFacade: jest.Mocked<EnrollmentFacade>,
      appointmentFacade: jest.Mocked<AppointmentFacade>,
      appointmentTypeFacade: jest.Mocked<AppointmentTypeFacade>,
      noteFacade: jest.Mocked<NoteFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(InstructorController).compile();

    controller = unit;
    studentFacade = unitRef.get(StudentFacade);
    schoolFacade = unitRef.get(SchoolFacade);
    teamMembersFacade = unitRef.get(TeamMemberFacade);
    enrollmentFacade = unitRef.get(EnrollmentFacade);
    appointmentFacade = unitRef.get(AppointmentFacade);
    appointmentTypeFacade = unitRef.get(AppointmentTypeFacade);
    noteFacade = unitRef.get(NoteFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
