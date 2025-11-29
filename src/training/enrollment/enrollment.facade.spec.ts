import { EnrollmentFacade } from './enrollment.facade';
import { UserRepository } from '../../user/user.repository';
import { SchoolRepository } from '../school/school.repository';
import { EnrollmentRepository } from './enrollment.repository';
import { StudentRepository } from '../student/student.repository';
import { TeamMemberRepository } from '../team-member/team-member.repository';
import { EmailService } from '../../email/email.service';
import { ControlSheetRepository } from '../control-sheet/control-sheet.repository';

describe('EnrollmentFacade', () => {
  let facade: EnrollmentFacade,
      userRepository: jest.Mocked<UserRepository>,
      schoolRepository: jest.Mocked<SchoolRepository>,
      enrollmentRepository: jest.Mocked<EnrollmentRepository>,
      studentRepository: jest.Mocked<StudentRepository>,
      teamMemberRepository: jest.Mocked<TeamMemberRepository>,
      emailService: jest.Mocked<EmailService>,
      controlSheetRepository: jest.Mocked<ControlSheetRepository>;

  beforeAll(async () => {
    enrollmentRepository = {} as any;
    userRepository = {} as any;
    studentRepository = {} as any;
    teamMemberRepository = {} as any;
    schoolRepository = {} as any;
    emailService = {} as any;
    controlSheetRepository = {} as any;
    facade = new EnrollmentFacade(enrollmentRepository, userRepository, studentRepository, teamMemberRepository, schoolRepository, emailService, controlSheetRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
