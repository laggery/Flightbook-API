import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SchoolException } from '../school/exception/school.exception';
import { School } from '../school/school.entity';
import { SchoolService } from '../school/school.service';
import { AppointmentType } from './appointment-type.entity';
import { AppointmentTypeRepository } from './appointment-type.repository';
import { AppointmentException } from './exception/appointment.exception';
import { AppointmentTypeDto } from './interface/appointment-type-dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserException } from 'src/user/exception/user.exception';
import { AppointmentTypeMapper } from './appointment-type.mapper';

@Injectable()
export class AppointmentTypeFacade {

    constructor(
        private appointmentTypeRepository: AppointmentTypeRepository,
        private schoolService: SchoolService,
        private userService: UserService
    ) {}

    async getAppointmentTypesBySchoolId(schoolId: number, query: any): Promise<AppointmentTypeDto[]> {
        const types: AppointmentType[] = await this.appointmentTypeRepository.getAppointmentTypesBySchoolId(schoolId, query);
        return AppointmentTypeMapper.toAppointmentTypeDtoList(types);
    }

    async createAppointmentType(schoolId: number, appointmentTypeDto: AppointmentTypeDto): Promise<AppointmentTypeDto> {
        const { instructor } = appointmentTypeDto;
        let type: AppointmentType = plainToInstance(AppointmentType, appointmentTypeDto);
        type.id = null;
        await this.appointmentTypeValidityCheck(appointmentTypeDto, schoolId, type);

        if (instructor && instructor.email) {
            const instructorEntity: User = await this.userService.getUserByEmail(instructor.email);

            if (!instructorEntity) {
                UserException.invalidEmailException("instructor");
            }
            type.instructor = instructorEntity;
        }

        const appointmentTypeResp: AppointmentType = await this.appointmentTypeRepository.saveAppointmentType(type);

        return plainToInstance(AppointmentTypeDto, appointmentTypeResp);
    }

    async updateAppointmentType(id: number, schoolId: number, appointmentTypeDto: AppointmentTypeDto): Promise<AppointmentTypeDto> {
        const { name, archived, color, maxPeople, meetingPoint, time, instructor } = appointmentTypeDto;
        let type: AppointmentType = await this.appointmentTypeRepository.getAppointmentTypesById(id);
        if (!type) {
            AppointmentException.invalidAppointmentTypeId();
        }

        await this.appointmentTypeValidityCheck(appointmentTypeDto, schoolId, type);

        type.name = name;
        type.archived = archived;
        type.color = color || null;
        type.maxPeople = maxPeople || null;
        type.meetingPoint = meetingPoint || null;
        type.time = time || null;

        if (instructor && instructor.email) {
            const instructorEntity: User = await this.userService.getUserByEmail(instructor.email);

            if (!instructorEntity) {
                UserException.invalidEmailException("instructor");
            }
            type.instructor = instructorEntity;
        } else {
            type.instructor = null;
        }

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
