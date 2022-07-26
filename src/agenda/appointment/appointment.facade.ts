import { Injectable } from '@nestjs/common';
import { AppointmentDto } from "./interface/appointment-dto";
import { plainToInstance } from "class-transformer";
import { Appointment } from "./appointment.entity";
import { AppointmentService } from "./appointment.service";
import { School } from "../../school/school.entity";
import { SchoolService } from "../../school/school.service";
import { AppointmentException } from "./exception/appointment.exception";
import { SchoolException } from "../../school/exception/school.exception";
import { UserService } from "../../user/user.service";
import { User } from "../../user/user.entity";
import { UserException } from 'src/user/exception/user.exception';
import { AppointmentMapper } from './appointment.mapper';

@Injectable()
export class AppointmentFacade {

    constructor(
        private appointmentService: AppointmentService,
        private schoolService: SchoolService,
        private userService: UserService
    ) { }

    async createAppointment(schoolId: number, appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        let appointment: Appointment = plainToInstance(Appointment, appointmentDto);
        await this.appointmentValidityCheck(appointmentDto, schoolId, appointment);

        const appointmentResp: Appointment = await this.appointmentService.saveAppointment(appointment);
        return AppointmentMapper.toAppointmentDto(appointmentResp);
    }

    async updateAppointment(id: number, schoolId: number, appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        let appointment: Appointment = await this.appointmentService.getAppointmentById(id);
        await this.appointmentValidityCheck(appointmentDto, schoolId, appointment);

        appointment.description = appointmentDto.description;
        appointment.maxPeople = appointmentDto.maxPeople;
        appointment.meetingPoint = appointmentDto.meetingPoint;
        appointment.scheduling = appointmentDto.scheduling;
        appointment.state = appointmentDto.state;
        appointment.timestamp = new Date();

        const appointmentResp: Appointment = await this.appointmentService.saveAppointment(appointment);
        return AppointmentMapper.toAppointmentDto(appointmentResp);
    }

    getAppointmentsBySchoolId(schoolId: number, query: any): Promise<AppointmentDto[]> {
        return this.appointmentService.getAppointmentsBySchoolId(schoolId, {});
    }

    private async appointmentValidityCheck(appointmentDto: AppointmentDto, schoolId: number, appointment: Appointment) {
        const { scheduling, meetingPoint, state, school, instructor, takeOffCoordinator } = appointmentDto;

        if (!scheduling || !meetingPoint || !state || !school || !instructor) {
            throw AppointmentException.invalidAppointment();
        }

        const schoolEntity: School = await this.schoolService.getSchoolById(schoolId);

        if (!schoolEntity) {
            SchoolException.invalidIdException();
        }
        appointment.school = schoolEntity;

        const instructorEntity: User = await this.userService.getUserByEmail(instructor.email);

        if (!instructorEntity) {
            UserException.invalidEmailException("instructor");
        }
        appointment.instructor = instructorEntity;

        if (takeOffCoordinator) {
            const takeOffCoordinatorEntity: User = await this.userService.getUserByEmail(takeOffCoordinator.email);
            if (!takeOffCoordinator) {
                UserException.invalidEmailException("takeOffCoordinator");
            }
            appointment.takeOffCoordinator = takeOffCoordinatorEntity;
        } else {
            appointment.takeOffCoordinator = null;
        }
    }
}
