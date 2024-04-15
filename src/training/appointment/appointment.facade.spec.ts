import { UserRepository } from '../../user/user.repository';
import { TestBed } from '@automock/jest';
import { AppointmentFacade } from './appointment.facade';
import { AppointmentRepository } from './appointment.repository';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { StudentRepository } from '../student/student.repository';
import { SchoolRepository } from '../school/school.repository';
import { NotificationsService } from '../../shared/services/notifications.service';
import { EmailService } from '../../email/email.service';
import { AppointmentTypeRepository } from './appointment-type.repository';

describe('AppointmentFacade', () => {
  let facade: AppointmentFacade,
      appointmentRepository: jest.Mocked<AppointmentRepository>,
      appointmentTypeRepository: jest.Mocked<AppointmentTypeRepository>,
      schoolRepository: jest.Mocked<SchoolRepository>,
      studentRepository: jest.Mocked<StudentRepository>,
      subscriptionRepository: jest.Mocked<SubscriptionRepository>,
      userRepository: jest.Mocked<UserRepository>,
      emailService: jest.Mocked<EmailService>,
      notificationsService: jest.Mocked<NotificationsService>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(AppointmentFacade).compile();

    facade = unit;
    appointmentRepository = unitRef.get(AppointmentRepository);
    appointmentTypeRepository = unitRef.get(AppointmentTypeRepository);
    schoolRepository = unitRef.get(SchoolRepository);
    studentRepository = unitRef.get(StudentRepository);
    subscriptionRepository = unitRef.get(SubscriptionRepository);
    emailService = unitRef.get(EmailService);
    notificationsService = unitRef.get(NotificationsService);
    userRepository = unitRef.get(UserRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
