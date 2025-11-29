import { UserRepository } from '../../user/user.repository';
import { AppointmentFacade } from './appointment.facade';
import { AppointmentRepository } from './appointment.repository';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { GuestSubscriptionRepository } from '../subscription/guest-subscription.repository';
import { StudentRepository } from '../student/student.repository';
import { SchoolRepository } from '../school/school.repository';
import { NotificationsService } from '../../shared/services/notifications.service';
import { EmailService } from '../../email/email.service';
import { AppointmentTypeRepository } from './appointment-type.repository';
import { FlightRepository } from '../../flight/flight.repository';

describe('AppointmentFacade', () => {
  let facade: AppointmentFacade,
      appointmentRepository: jest.Mocked<AppointmentRepository>,
      appointmentTypeRepository: jest.Mocked<AppointmentTypeRepository>,
      schoolRepository: jest.Mocked<SchoolRepository>,
      studentRepository: jest.Mocked<StudentRepository>,
      subscriptionRepository: jest.Mocked<SubscriptionRepository>,
      guestSubscriptionRepository: jest.Mocked<GuestSubscriptionRepository>,
      userRepository: jest.Mocked<UserRepository>,
      emailService: jest.Mocked<EmailService>,
      notificationsService: jest.Mocked<NotificationsService>,
      flightRepository: jest.Mocked<FlightRepository>;

  beforeAll(async () => {
    appointmentRepository = {} as any;
    appointmentTypeRepository = {} as any;
    studentRepository = {} as any;
    subscriptionRepository = {} as any;
    guestSubscriptionRepository = {} as any;
    schoolRepository = {} as any;
    userRepository = {} as any;
    emailService = {} as any;
    notificationsService = {} as any;
    flightRepository = {} as any;
    facade = new AppointmentFacade(appointmentRepository, appointmentTypeRepository, studentRepository, subscriptionRepository, guestSubscriptionRepository, schoolRepository, userRepository, emailService, notificationsService, flightRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
