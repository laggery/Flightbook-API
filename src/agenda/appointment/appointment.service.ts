import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentService {

    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>
    ) { }

    async saveAppointment(appointment: Appointment): Promise<Appointment | undefined> {
        return await this.appointmentRepository.save(appointment);
    }

    async getAppointmentById(id: number): Promise<Appointment> {
        return this.appointmentRepository.findOneOrFail({ id: id });
    }
    
    async getAppointmentsBySchoolId(schoolId: number, query: any): Promise<Appointment[]> {
        const options: any = {
            relations: ["instructor", "takeOffCoordinator"],
            where: {
                school: {
                    id: schoolId
                }
            },
            order: {
                scheduling: 'DESC'
            }
        };

        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            options.take = query.limit;
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            options.skip = query.offset;
        }

        return await this.appointmentRepository.find(options);
    }
}
