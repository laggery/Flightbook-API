import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SchoolException } from '../school/exception/school.exception';
import { School } from '../school/school.entity';
import { SchoolService } from '../school/school.service';
import { AppointmentType } from './appointment-type.entity';
import { AppointmentTypeRepository } from './appointment-type.repository';
import { AppointmentException } from './exception/appointment.exception';
import { AppointmentTypeDto } from './interface/appointment-type-dto';

@Injectable()
export class AppointmentTypeFacade {

    constructor(
        private appointmentTypeRepository: AppointmentTypeRepository,
        private schoolService: SchoolService,
    ) {}

    async getAppointmentTypesBySchoolId(schoolId: number, query: any): Promise<AppointmentTypeDto[]> {
        const types: AppointmentType[] = await this.appointmentTypeRepository.getAppointmentTypesBySchoolId(schoolId, query);
        return plainToInstance(AppointmentTypeDto, types);
    }

    async createAppointmentType(schoolId: number, appointmentTypeDto: AppointmentTypeDto): Promise<AppointmentTypeDto> {
        let type: AppointmentType = plainToInstance(AppointmentType, appointmentTypeDto);
        type.id = null;
        await this.appointmentTypeValidityCheck(appointmentTypeDto, schoolId, type);

        const appointmentTypeResp: AppointmentType = await this.appointmentTypeRepository.saveAppointmentType(type);

        return plainToInstance(AppointmentTypeDto, appointmentTypeResp);
    }

    async updateAppointmentType(id: number, schoolId: number, appointmentTypeDto: AppointmentTypeDto): Promise<AppointmentTypeDto> {
        let type: AppointmentType = await this.appointmentTypeRepository.getAppointmentTypesById(id);
        if (!type) {
            AppointmentException.invalidAppointmentTypeId();
        }

        await this.appointmentTypeValidityCheck(appointmentTypeDto, schoolId, type);

        type.name = appointmentTypeDto.name;
        type.archived = appointmentTypeDto.archived;

        const appointmentTypeResp: AppointmentType = await this.appointmentTypeRepository.saveAppointmentType(type);

        return plainToInstance(AppointmentTypeDto, appointmentTypeResp);
    }

    private async appointmentTypeValidityCheck(appointmentTypDto: AppointmentTypeDto, schoolId: number, appointmentType: AppointmentType) {
        const { name } = appointmentTypDto;

        if (!name) {
            throw AppointmentException.invalidAppointmentType();
        }

        const schoolEntity: School = await this.schoolService.getSchoolById(schoolId);

        if (!schoolEntity) {
            SchoolException.invalidIdException();
        }
        appointmentType.school = schoolEntity;
    }
}
