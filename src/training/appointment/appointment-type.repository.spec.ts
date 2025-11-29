import { Repository } from 'typeorm';
import { AppointmentType } from './appointment-type.entity';
import { AppointmentTypeRepository } from './appointment-type.repository';

describe('AppointmentType Repository', () => {
  let appointmentTypeRepository: AppointmentTypeRepository;

  beforeAll(async () => {
    const repository = {} as Repository<AppointmentType>;
    appointmentTypeRepository = new AppointmentTypeRepository(repository);
  });

  it('should be defined', () => {
    expect(appointmentTypeRepository).toBeDefined();
  });
});
