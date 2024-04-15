import { TestBed } from '@automock/jest';
import { AppointmentTypeRepository } from './appointment-type.repository';

describe('AppointmentType Repository', () => {
  let appointmentTypeRepository: AppointmentTypeRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(AppointmentTypeRepository).compile();

    appointmentTypeRepository = unit;
  });

  it('should be defined', () => {
    expect(appointmentTypeRepository).toBeDefined();
  });
});
