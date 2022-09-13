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
import { Subscription } from '../subscription/subscription.entity';
import { SubscriptionException } from '../subscription/exception/subscription.exception';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class AppointmentFacade {

    constructor(
        private appointmentService: AppointmentService,
        private subscriptionService: SubscriptionService,
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

    async addSubscriptionToAppointment(appointmentId: number, userId: number): Promise<AppointmentDto> {
        const appointment: Appointment = await this.appointmentService.getAppointmentById(appointmentId);
        const user: User = await this.userService.getUserById(userId);
        const subscription = new Subscription();
        subscription.user = user
        if (!appointment.subscriptions) {
            appointment.subscriptions = []
        } else {
            const findSubscription = appointment.subscriptions.find((subscription: Subscription) => {
                if (subscription.user.id == userId) {
                    return true;
                }
            });

            if (findSubscription) {
                throw SubscriptionException.alreadyExistsException();
            }
        }
        appointment.subscriptions.push(subscription);

        const appointmentResp: Appointment = await this.appointmentService.saveAppointment(appointment);
        return AppointmentMapper.toAppointmentDto(appointmentResp);
    }

    async deleteSubscriptionFromAppointment(appointmentId: number, userId: number): Promise<AppointmentDto> {
        const appointment: Appointment = await this.appointmentService.getAppointmentById(appointmentId);
        if (appointment.subscriptions) {
            const subscriptionToDelete = appointment.subscriptions.find((subscription: Subscription) => {
                if (subscription.user.id == userId) {
                    return true;
                }
            });

            this.subscriptionService.removeSubscription(subscriptionToDelete);
        }
        return AppointmentMapper.toAppointmentDto(appointment);
    }

    async getAppointmentsBySchoolId(schoolId: number, query: any): Promise<AppointmentDto[]> {
        const appointments = await this.appointmentService.getAppointmentsBySchoolId(schoolId, query);
        return AppointmentMapper.toAppointmentDtoList(appointments);
    }

    async getAppointmentById(id: number): Promise<AppointmentDto> {
        const appointment = await this.appointmentService.getAppointmentById(id);
        return AppointmentMapper.toAppointmentDto(appointment);
    }

    private async appointmentValidityCheck(appointmentDto: AppointmentDto, schoolId: number, appointment: Appointment) {
        const { scheduling, meetingPoint, state, instructor, takeOffCoordinator } = appointmentDto;

        if (!scheduling || !meetingPoint || !state || !instructor) {
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
