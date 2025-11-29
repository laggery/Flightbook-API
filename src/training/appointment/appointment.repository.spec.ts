import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentRepository } from './appointment.repository';

describe('Appointment Repository', () => {
  let appointmentRepository: AppointmentRepository;

  beforeAll(async () => {
    const repository = {} as Repository<Appointment>;
    appointmentRepository = new AppointmentRepository(repository);
  });

  it('should be defined', () => {
    expect(appointmentRepository).toBeDefined();
  });
});
