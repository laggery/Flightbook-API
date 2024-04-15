import { TestBed } from '@automock/jest';
import { AppointmentRepository } from './appointment.repository';

describe('Appointment Repository', () => {
  let appointmentRepository: AppointmentRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(AppointmentRepository).compile();

    appointmentRepository = unit;
  });

  it('should be defined', () => {
    expect(appointmentRepository).toBeDefined();
  });
});
