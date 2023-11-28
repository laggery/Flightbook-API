import { Injectable } from '@nestjs/common';
import { AppointmentDto } from "./interface/appointment-dto";
import { plainToInstance } from "class-transformer";
import { Appointment } from "./appointment.entity";
import { AppointmentRepository } from "./appointment.repository";
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
import { NotificationsService } from 'src/shared/services/notifications.service';
import { StudentRepository } from '../student/student.repository';
import { SubscriptionDto } from '../subscription/interface/subscription-dto';
import { Student } from '../student/student.entity';
import { AppointmentType } from './appointment-type.entity';
import { AppointmentTypeRepository } from './appointment-type.repository';
import { GuestSubscription } from '../subscription/guest-subscription.entity';
import { GuestSubscriptionDto } from '../subscription/interface/guest-subscription-dto';

@Injectable()
export class AppointmentFacade {

    constructor(
        private appointmentRepository: AppointmentRepository,
        private appointmentTypeRepository: AppointmentTypeRepository,
        private studentRepository: StudentRepository,
        private subscriptionService: SubscriptionService,
        private schoolService: SchoolService,
        private userService: UserService,
        private emailService: EmailService,
        private notificationsService: NotificationsService
    ) { }

    async createAppointment(schoolId: number, appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        let appointment: Appointment = plainToInstance(Appointment, appointmentDto);
        await this.appointmentValidityCheck(appointmentDto, schoolId, appointment);

        const appointmentResp: Appointment = await this.appointmentRepository.saveAppointment(appointment);

        const students = await this.studentRepository.getStudentsBySchoolId(schoolId, false);

        if (appointment.subscriptions.length > 0) {
            const addedStudents = [];
            appointment.subscriptions.forEach((subscription: Subscription) => {
                const index = students.findIndex((student: Student) => student.user.email === subscription.user.email);
                if (index !== -1) {
                    addedStudents.push(students[index]);
                    students.splice(index, 1);
                }
            });
            this.emailService.sendAppointmentSubscription(addedStudents, appointment);
            this.notificationsService.sendAppointmentSubscription(addedStudents, appointment);
        }

        this.emailService.sendNewAppointment(students, appointment);
        this.notificationsService.sendNewAppointment(students, appointment);

        return AppointmentMapper.toAppointmentDto(appointmentResp);
    }

    async updateAppointment(id: number, schoolId: number, appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        let appointment: Appointment = await this.appointmentRepository.getAppointmentById(id);
        await this.appointmentValidityCheck(appointmentDto, schoolId, appointment);

        const previousState = appointment.state;

        appointment.description = appointmentDto.description;
        appointment.maxPeople = appointmentDto.maxPeople;
        appointment.meetingPoint = appointmentDto.meetingPoint;
        appointment.scheduling = appointmentDto.scheduling;
        appointment.state = appointmentDto.state;
        appointment.takeOffCoordinatorText = appointmentDto.takeOffCoordinatorText == "" ? null : appointmentDto.takeOffCoordinatorText;
        appointment.timestamp = new Date();

        // Clear removed subscriptions
        appointment.subscriptions.forEach((subscription: Subscription) => {
            const subscriptionDto = appointmentDto.subscriptions.find((subscriptionDto: SubscriptionDto) => subscriptionDto.user?.email === subscription.user.email);
            if (!subscriptionDto) {
                appointment.removeUserSubscription(subscription.user.id);
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

        // Update or clear removed guestsubscriptions
        appointment.guestSubscriptions.forEach((guestSubscription: GuestSubscription) => {
            const guestSubscriptionDto = appointmentDto.guestSubscriptions.find((guestSubscriptionDto: GuestSubscriptionDto) => guestSubscriptionDto.id === guestSubscription.id);
            if (guestSubscriptionDto) {
                guestSubscription.firstname = guestSubscriptionDto.firstname;
                guestSubscription.lastname = guestSubscriptionDto.lastname;
            } else {
                appointment.removeGuestUserSubscription(guestSubscription.id);
                this.subscriptionService.removeGuestSubscription(guestSubscription);
            }
        });

        // add new subscriptions
        appointmentDto.guestSubscriptions.forEach((guestSubscriptionDto: GuestSubscriptionDto) => {
            if (!appointment.findGuestSubscription(guestSubscriptionDto.id)) {
                const guestSubscription: GuestSubscription = plainToInstance(GuestSubscription, guestSubscriptionDto);
                appointment.guestSubscriptions.push(guestSubscription);
            }
        });

        if (previousState != appointmentDto.state) {
            this.notificationsService.sendAppointmentStateChanged(appointment);
        }

        const appointmentResp: Appointment = await this.appointmentRepository.saveAppointment(appointment);
        return AppointmentMapper.toAppointmentDto(appointmentResp);
    }

    async addSubscriptionToAppointment(appointmentId: number, userId: number): Promise<AppointmentDto> {
        const appointment: Appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
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

        const appointmentResp: Appointment = await this.appointmentRepository.saveAppointment(appointment);
        return AppointmentMapper.toAppointmentDto(appointmentResp);
    }

    async deleteSubscriptionFromAppointment(appointmentId: number, userId: number, school: SchoolDto): Promise<AppointmentDto> {
        const appointment: Appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
        if (appointment.subscriptions) {
            const nbSubscription = appointment.subscriptions.length;
            const isUserOnWaintingList = appointment.isUserOnWaintingList(userId);
            const subscriptionToDelete = appointment.removeUserSubscription(userId);

            // Inform waiting student
            if (appointment.maxPeople && subscriptionToDelete && !isUserOnWaintingList && nbSubscription > appointment.maxPeople ) {
                const subscriptionToInform = appointment.subscriptions[appointment.maxPeople - 1];
                this.emailService.sendInformWaitingStudent(school, appointment, subscriptionToInform);
                this.notificationsService.sendInformWaitingStudent(appointment, subscriptionToInform);
            }

            this.subscriptionService.removeSubscription(subscriptionToDelete);
            this.emailService.sendUnsubscribeEmail(school, appointment, subscriptionToDelete);
        }
        return AppointmentMapper.toAppointmentDto(appointment);
    }

    async getAppointmentsBySchoolId(schoolId: number, query: any): Promise<PagerEntityDto<AppointmentDto[]>> {
        const appointmentsPager = await this.appointmentRepository.getAppointmentsBySchoolId(schoolId, query);
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
        const appointment = await this.appointmentRepository.getAppointmentById(id);
        return AppointmentMapper.toAppointmentDto(appointment);
    }

    private async appointmentValidityCheck(appointmentDto: AppointmentDto, schoolId: number, appointment: Appointment) {
        const { scheduling, meetingPoint, state, instructor, takeOffCoordinator, type } = appointmentDto;

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

        if (type && type.id) {
            const typeEntity: AppointmentType = await this.appointmentTypeRepository.getAppointmentTypesById(type.id);
            if (!typeEntity) {
                AppointmentException.invalidAppointmentTypeId();
            }
            appointment.type = typeEntity;
        } else {
            appointment.type = null;
        }
    }
}
