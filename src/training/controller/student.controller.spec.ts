import { EnrollmentFacade } from '../enrollment/enrollment.facade';
import { TestBed } from '@automock/jest';
import { StudentController } from './student.controller';
import { StudentFacade } from '../student/student.facade';
import { AppointmentFacade } from '../appointment/appointment.facade';
import { TeamMemberFacade } from '../team-member/team-member.facade';
import { ControlSheetFacade } from '../control-sheet/control-sheet.facade';

describe('Student Controller', () => {
  let controller: StudentController,
      studentFacade: jest.Mocked<StudentFacade>,
      controlSheetFacade: jest.Mocked<ControlSheetFacade>,
      teamMembersFacade: jest.Mocked<TeamMemberFacade>,
      enrollmentFacade: jest.Mocked<EnrollmentFacade>,
      appointmentFacade: jest.Mocked<AppointmentFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(StudentController).compile();

    controller = unit;
    studentFacade = unitRef.get(StudentFacade);
    controlSheetFacade = unitRef.get(ControlSheetFacade);
    teamMembersFacade = unitRef.get(TeamMemberFacade);
    enrollmentFacade = unitRef.get(EnrollmentFacade);
    appointmentFacade = unitRef.get(AppointmentFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
