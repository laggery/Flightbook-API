import { Injectable } from '@nestjs/common';
import { AppointmentDto } from "./interface/appointment-dto";
import { plainToInstance } from "class-transformer";
import { Appointment } from "./appointment.entity";
import { AppointmentService } from "./appointment.service";
import { School } from "../school/school.entity";
import { SchoolService } from "../school/school.service";
import { AppointmentException } from "./exception/appointment.exception";
import { SchoolException } from "../school/exception/school.exception";
import { UserService } from "../../user/user.service";
import { User } from "../../user/user.entity";
import { UserException } from 'src/user/exception/user.exception';
import { AppointmentMapper } from './appointment.mapper';
import { Subscription } from '../subscription/subscription.entity';
import { SubscriptionException } from '../subscription/exception/subscription.exception';
import { SubscriptionService } from '../subscription/subscription.service';
import { PagerEntityDto } from 'src/interface/pager-entity-dto';
import { EmailService } from 'src/email/email.service';
import { SchoolDto } from '../school/interface/school-dto';
import { I18nContext } from 'nestjs-i18n';
import { NotificationsService } from 'src/shared/services/notifications.service';
import { StudentService } from '../student/student.service';
import { SubscriptionDto } from '../subscription/interface/subscription-dto';
import { Student } from '../student/student.entity';

@Injectable()
export class AppointmentFacade {

    constructor(
        private appointmentService: AppointmentService,
        private studentService: StudentService,
        private subscriptionService: SubscriptionService,
        private schoolService: SchoolService,
        private userService: UserService,
        private emailService: EmailService,
        private notificationsService: NotificationsService
    ) { }

    async createAppointment(schoolId: number, appointmentDto: AppointmentDto, i18n: I18nContext): Promise<AppointmentDto> {
        let appointment: Appointment = plainToInstance(Appointment, appointmentDto);
        await this.appointmentValidityCheck(appointmentDto, schoolId, appointment);

        const appointmentResp: Appointment = await this.appointmentService.saveAppointment(appointment);

        const students = await this.studentService.getStudentsBySchoolId(schoolId);

        if (appointment.subscriptions.length > 0) {
            const addedStudents = [];
            appointment.subscriptions.forEach((subscription: Subscription) => {
                const index = students.findIndex((student: Student) => student.user.email === subscription.user.email);
                if (index !== -1) {
                    addedStudents.push(students[index]);
                    students.splice(index, 1);
                }
            });
            this.emailService.sendAppointmentSubscription(addedStudents, appointment, i18n);
            this.notificationsService.sendAppointmentSubscription(addedStudents, appointment, i18n);
        }

        this.emailService.sendNewAppointment(students, appointment, i18n);
        this.notificationsService.sendNewAppointment(students, appointment, i18n);

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

        // Clear removed subscriptions
        appointment.subscriptions.forEach((subscription: Subscription) => {
            const subscriptionDto = appointmentDto.subscriptions.find((subscriptionDto: SubscriptionDto) => subscriptionDto.user.email === subscription.user.email);
            if (!subscriptionDto) {
                appointment.removeUserSubscription(subscription.user.email);
                this.subscriptionService.removeSubscription(subscription);
            }
        });

        // add new subscriptions
        appointmentDto.subscriptions.forEach((subscriptionDto: SubscriptionDto) => {
            if (!appointment.findSubscription(subscriptionDto.user.email)) {
                const subscription: Subscription = plainToInstance(Subscription, subscriptionDto);
                appointment.subscriptions.push(subscription);
            }
        });

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

    async deleteSubscriptionFromAppointment(appointmentId: number, userId: number, school: SchoolDto, i18n: I18nContext): Promise<AppointmentDto> {
        const appointment: Appointment = await this.appointmentService.getAppointmentById(appointmentId);
        if (appointment.subscriptions) {
            const subscriptionToDelete = appointment.subscriptions.find((subscription: Subscription) => {
                if (subscription.user.id == userId) {
                    return true;
                }
            });

            this.subscriptionService.removeSubscription(subscriptionToDelete);
            this.emailService.sendUnsubscribeEmail(school, appointment, subscriptionToDelete, i18n);
        }
        return AppointmentMapper.toAppointmentDto(appointment);
    }

    async getAppointmentsBySchoolId(schoolId: number, query: any): Promise<PagerEntityDto<AppointmentDto[]>> {
        const appointmentsPager = await this.appointmentService.getAppointmentsBySchoolId(schoolId, query);
        const entityPager = new PagerEntityDto<AppointmentDto[]>();
        entityPager.entity = AppointmentMapper.toAppointmentDtoList(appointmentsPager[0]);
        entityPager.itemCount = appointmentsPager[0].length;
        entityPager.totalItems = appointmentsPager[1];
        entityPager.itemsPerPage = (query?.limit) ? Number(query.limit) : entityPager.itemCount;
        entityPager.totalPages = (query?.limit) ? Math.ceil(entityPager.totalItems / Number(query.limit)) : entityPager.totalItems;
        entityPager.currentPage = (query?.offset) ? (query.offset >= entityPager.totalItems ? null : Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1) : 1;
        return entityPager;
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
