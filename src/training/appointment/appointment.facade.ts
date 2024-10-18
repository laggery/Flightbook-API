import { Injectable } from '@nestjs/common';
import { AppointmentDto } from "./interface/appointment-dto";
import { plainToInstance } from "class-transformer";
import { Appointment } from "./appointment.entity";
import { AppointmentRepository } from "./appointment.repository";
import { School } from "../school/school.entity";
import { SchoolRepository } from "../school/school.repository";
import { AppointmentException } from "./exception/appointment.exception";
import { SchoolException } from "../school/exception/school.exception";
import { UserRepository } from "../../user/user.repository";
import { User } from "../../user/user.entity";
import { UserException } from '../../user/exception/user.exception';
import { AppointmentMapper } from './appointment.mapper';
import { Subscription } from '../subscription/subscription.entity';
import { SubscriptionException } from '../subscription/exception/subscription.exception';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { PagerEntityDto } from '../../interface/pager-entity-dto';
import { EmailService } from '../../email/email.service';
import { SchoolDto } from '../school/interface/school-dto';
import { NotificationsService } from '../../shared/services/notifications.service';
import { StudentRepository } from '../student/student.repository';
import { SubscriptionDto } from '../subscription/interface/subscription-dto';
import { Student } from '../student/student.entity';
import { AppointmentType } from './appointment-type.entity';
import { AppointmentTypeRepository } from './appointment-type.repository';
import { GuestSubscription } from '../subscription/guest-subscription.entity';
import { GuestSubscriptionDto } from '../subscription/interface/guest-subscription-dto';
import { GuestSubscriptionRepository } from '../subscription/guest-subscription.repository';
import { StudentMapper } from '../student/student.mapper';

@Injectable()
export class AppointmentFacade {

    constructor(
        private appointmentRepository: AppointmentRepository,
        private appointmentTypeRepository: AppointmentTypeRepository,
        private studentRepository: StudentRepository,
        private subscriptionRepository: SubscriptionRepository,
        private guestSubscriptionRepository: GuestSubscriptionRepository,
        private schoolRepository: SchoolRepository,
        private userRepository: UserRepository,
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

        return await this.generateWaitingList(AppointmentMapper.toAppointmentDto(appointmentResp), schoolId);
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
        const subscriptionsToRemove = appointment.subscriptions.filter((subscription: Subscription) => {
            return !appointmentDto.subscriptions.some((subscriptionDto: SubscriptionDto) => subscriptionDto.user?.email === subscription.user.email);
        });

        subscriptionsToRemove.forEach((subscription: Subscription) => {
            appointment.removeUserSubscription(subscription.user.id);
            this.subscriptionRepository.remove(subscription);
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
                this.guestSubscriptionRepository.remove(guestSubscription);
            }
        });

        // add new guest subscriptions
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
        return await this.generateWaitingList(AppointmentMapper.toAppointmentDto(appointmentResp), schoolId);
    }

    async addSubscriptionToAppointment(appointmentId: number, userId: number): Promise<AppointmentDto> {
        const appointment: Appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
        const user: User = await this.userRepository.getUserById(userId);
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
        return await this.generateWaitingList(AppointmentMapper.toAppointmentDto(appointmentResp), appointment.school.id);
    }

    async deleteSubscriptionFromAppointment(appointmentId: number, userId: number, school: SchoolDto): Promise<AppointmentDto> {
        const appointment: Appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
        if (appointment.subscriptions) {

            // Inform waiting student
            // Only for EMC student subscription - After migrate Subscription user to student the student request can be removed
            const students = await this.studentRepository.getStudentsBySchoolId(school.id);
            
            let countSubscription = 0;
            const waitingList = [];
            const studentToBeRemoved = students.find((student: Student) => student.user.id === userId);
            let freePlaces = studentToBeRemoved.getUsedPlaces();

            appointment.subscriptions.forEach((subscription: Subscription) => {
                const foundStudent = students.find((student: Student) => student.user.email === subscription.user.email);

                if (appointment.maxPeople && (countSubscription + foundStudent.getUsedPlaces()) > appointment.maxPeople) {
                    waitingList.push(foundStudent);
                    if (freePlaces > 0 && foundStudent.getUsedPlaces() <= freePlaces) {
                        this.emailService.sendInformWaitingStudent(school, appointment, subscription);
                        this.notificationsService.sendInformWaitingStudent(appointment, subscription);
                        freePlaces -= foundStudent.getUsedPlaces();
                    }
                } else {
                    countSubscription += foundStudent.getUsedPlaces();
                }
            });

            const subscriptionToDelete = appointment.removeUserSubscription(userId);

            this.subscriptionRepository.remove(subscriptionToDelete);
            this.emailService.sendUnsubscribeEmail(school, appointment, subscriptionToDelete);
        }
        return AppointmentMapper.toAppointmentDto(appointment);
    }

    async getAppointmentsBySchoolId(schoolId: number, query: any): Promise<PagerEntityDto<AppointmentDto[]>> {
        const appointmentsPager = await this.appointmentRepository.getAppointmentsBySchoolId(schoolId, query);
        const entityPager = new PagerEntityDto<AppointmentDto[]>();
        entityPager.entity = await this.generateWaitingList(AppointmentMapper.toAppointmentDtoList(appointmentsPager[0]), schoolId);
        entityPager.itemCount = appointmentsPager[0].length;
        entityPager.totalItems = appointmentsPager[1];
        entityPager.itemsPerPage = (query?.limit) ? Number(query.limit) : entityPager.itemCount;
        entityPager.totalPages = (query?.limit) ? Math.ceil(entityPager.totalItems / Number(query.limit)) : entityPager.totalItems;
        entityPager.currentPage = (query?.offset) ? (query.offset >= entityPager.totalItems ? null : Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1) : 1;
        return entityPager;
    }

    async getAppointmentById(id: number): Promise<AppointmentDto> {
        const appointment = await this.appointmentRepository.getAppointmentById(id);
        return await this.generateWaitingList(AppointmentMapper.toAppointmentDto(appointment), appointment.school.id);
    }

    private async appointmentValidityCheck(appointmentDto: AppointmentDto, schoolId: number, appointment: Appointment) {
        const { scheduling, state, instructor, takeOffCoordinator, type } = appointmentDto;

        if (!scheduling || !state ) {
            throw AppointmentException.invalidAppointment();
        }

        const schoolEntity: School = await this.schoolRepository.getSchoolById(schoolId);

        if (!schoolEntity) {
            SchoolException.invalidIdException();
        }
        appointment.school = schoolEntity;

        if (instructor && instructor.email) {
            const instructorEntity: User = await this.userRepository.getUserByEmail(instructor.email);

            if (!instructorEntity) {
                UserException.invalidEmailException("instructor");
            }
            appointment.instructor = instructorEntity;
        } else {
            appointment.instructor = null;
        }

        if (takeOffCoordinator) {
            const takeOffCoordinatorEntity: User = await this.userRepository.getUserByEmail(takeOffCoordinator.email);
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

    // Overload signatures
    private async generateWaitingList(appointmentDto: AppointmentDto, schoolId: number): Promise<AppointmentDto>;
    private async generateWaitingList(appointmentDtoList: AppointmentDto[], schoolId: number): Promise<AppointmentDto[]>;

    private async generateWaitingList(appointmentDtoOrList: AppointmentDto | AppointmentDto[], schoolId: number): Promise<AppointmentDto | AppointmentDto[]> {
        const appointmentDtoList = Array.isArray(appointmentDtoOrList) ? appointmentDtoOrList : [appointmentDtoOrList];
        // Only for EMC student subscription - After migrate Subscription user to student the student request can be removed
        const students = await this.studentRepository.getStudentsBySchoolId(schoolId);
        appointmentDtoList.forEach((appointmentDto: AppointmentDto) => {
            let countSubscription = 0;
            let countWaitingList = 0;
            appointmentDto.subscriptions.forEach((subscriptionDto: SubscriptionDto) => {
                const foundStudent = students.find((student: Student) => student.user.email === subscriptionDto.user.email);
                if (!foundStudent)  {
                   console.log(subscriptionDto);
                   console.log(students);
                }
                subscriptionDto.waitingList = true;

                if (appointmentDto.maxPeople && (countSubscription + foundStudent.getUsedPlaces()) > appointmentDto.maxPeople) {
                    countWaitingList += foundStudent.getUsedPlaces();
                } else {
                    countSubscription += foundStudent.getUsedPlaces();
                    subscriptionDto.waitingList = false;
                }

                subscriptionDto.student = StudentMapper.toStudentDto(foundStudent, null);
            });
            appointmentDto.countSubscription = countSubscription;
            appointmentDto.countGuestSubscription = appointmentDto.guestSubscriptions.length;
            appointmentDto.countWaitingList = countWaitingList;
        });
        return appointmentDtoOrList;
    }
}
