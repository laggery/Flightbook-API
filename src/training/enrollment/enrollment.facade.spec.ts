import { EnrollmentFacade } from './enrollment.facade';
import { UserRepository } from '../../user/user.repository';
import { SchoolRepository } from '../school/school.repository';
import { EnrollmentRepository } from './enrollment.repository';
import { TestBed } from '@automock/jest';
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
    const { unit, unitRef } = TestBed.create(EnrollmentFacade).compile();

    facade = unit;
    userRepository = unitRef.get(UserRepository);
    schoolRepository = unitRef.get(SchoolRepository);
    enrollmentRepository = unitRef.get(EnrollmentRepository);
    studentRepository = unitRef.get(StudentRepository);
    teamMemberRepository = unitRef.get(TeamMemberRepository);
    emailService = unitRef.get(EmailService);
    controlSheetRepository = unitRef.get(ControlSheetRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
