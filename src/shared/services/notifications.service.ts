import { Injectable, Logger } from '@nestjs/common';
import { initializeApp, cert } from "firebase-admin/app";
import * as moment from 'moment';
import { BatchResponse, getMessaging, MulticastMessage, SendResponse } from 'firebase-admin/messaging';
import { UserRepository } from '../../user/user.repository';
import { Student } from '../../training/student/student.entity';
import { Appointment } from '../../training/appointment/appointment.entity';
import { Subscription } from '../../training/subscription/subscription.entity';
import { I18nContext } from 'nestjs-i18n';

export enum NotificationType {
    APPOINTMENT = "APPOINTMENT"
  }

@Injectable()
export class NotificationsService {
    constructor(
        private userRepository: UserRepository
    ) {
        if (!process.env.FIREBASE_CREDENTIAL_JSON) {
            return;
        }
        const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);
        initializeApp({
            credential: cert(firebaseCredentials)
        });
    }

    async sendNewAppointment(students: Student[], appointment: Appointment) {

        const tokens = students.filter((student: Student) => student.user.notificationToken)
            .map((student: Student) => student.user.notificationToken);

        if (tokens.length == 0) {
            Logger.debug("no notification to send for new appointment");
            return
        }

        const i18n = I18nContext.current();

        const body = i18n.t('notification.appointment.new.body', {
            lang: appointment.school.language,
            args: {
                school: appointment.school.name,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm'),
                meetingPoint: appointment.meetingPoint || "-"
            }
        });
        const multicastMessage: MulticastMessage = {
            notification: {
                title: i18n.t('notification.appointment.new.title', { lang: appointment.school.language }),
                body: body
            },
            data: {
                type: NotificationType.APPOINTMENT,
                schoolId: `${appointment.school.id}`,
                appointmentId: `${appointment.id}`
            },
            tokens: tokens
        }
        const tokensToDelete: string[] = [];
        try {
            const batchResponse: BatchResponse = await getMessaging().sendEachForMulticast(multicastMessage, process.env.ENV != "prod");
            Logger.debug(batchResponse);
            batchResponse.responses.forEach((response: SendResponse, index: number) => {
                if (!response.success) {
                    tokensToDelete.push(tokens[index]);
                }
            });
        } catch (e: any) {
            Logger.error("Firebase sendEachForMulticast error", e);
        }

        this.userRepository.clearNotificationTokens(tokensToDelete);
    }

    async sendAppointmentSubscription(students: Student[], appointment: Appointment) {

        const tokens = students.filter((student: Student) => student.user.notificationToken)
            .map((student: Student) => student.user.notificationToken);

        if (tokens.length == 0) {
            Logger.debug("no notification to send for new appointment subscription");
            return
        }

        const i18n = I18nContext.current();

        const body = i18n.t('notification.appointment.subscription.body', {
            lang: appointment.school.language,
            args: {
                school: appointment.school.name,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm'),
                meetingPoint: appointment.meetingPoint || "-"
            }
        });
        const multicastMessage: MulticastMessage = {
            notification: {
                title: i18n.t('notification.appointment.subscription.title', { lang: appointment.school.language }),
                body: body
            },
            data: {
                type: NotificationType.APPOINTMENT,
                schoolId: `${appointment.school.id}`,
                appointmentId: `${appointment.id}`
            },
            tokens: tokens
        }
        const tokensToDelete: string[] = [];
        try {
            const batchResponse: BatchResponse = await getMessaging().sendEachForMulticast(multicastMessage, process.env.ENV != "prod");
            Logger.debug(batchResponse);
            batchResponse.responses.forEach((response: SendResponse, index: number) => {
                if (!response.success) {
                    tokensToDelete.push(tokens[index]);
                }
            });
        } catch (e: any) {
            Logger.error("Firebase sendEachForMulticast error", e);
        }

        this.userRepository.clearNotificationTokens(tokensToDelete);
    }

    async sendAppointmentStateChanged(appointment: Appointment) {

        const tokens = appointment.subscriptions.filter((subscription: Subscription) => subscription.user.notificationToken)
            .map((subscription: Subscription) => subscription.user.notificationToken);

        if (tokens.length == 0) {
            Logger.debug("no notification to send for appointment state change");
            return
        }

        const i18n = I18nContext.current();

        const body = i18n.t('notification.appointment.stateChanged.body', {
            lang: appointment.school.language,
            args: {
                school: appointment.school.name,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm')
            }
        });
        const multicastMessage: MulticastMessage = {
            notification: {
                title: i18n.t('notification.appointment.stateChanged.title', { lang: appointment.school.language }),
                body: body
            },
            data: {
                type: NotificationType.APPOINTMENT,
                schoolId: `${appointment.school.id}`,
                appointmentId: `${appointment.id}`
            },
            tokens: tokens
        }
        const tokensToDelete: string[] = [];
        try {
            const batchResponse: BatchResponse = await getMessaging().sendEachForMulticast(multicastMessage, process.env.ENV != "prod");
            Logger.debug(batchResponse);
            batchResponse.responses.forEach((response: SendResponse, index: number) => {
                if (!response.success) {
                    tokensToDelete.push(tokens[index]);
                }
            });
        } catch (e: any) {
            Logger.error("Firebase sendEachForMulticast error", e);
        }

        this.userRepository.clearNotificationTokens(tokensToDelete);
    }


    async sendInformWaitingStudent(appointment: Appointment, subscription: Subscription) {

        if (!subscription.user.notificationToken) {
            Logger.debug("no notification to send for inform waiting student");
            return
        }

        const i18n = I18nContext.current();

        const body = i18n.t('notification.appointment.informWaitingStudent.body', {
            lang: appointment.school.language,
            args: {
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm')
            }
        });

        const title = i18n.t('notification.appointment.informWaitingStudent.title', {
            lang: appointment.school.language,
            args: {
                school: appointment.school.name,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm')
            }
        });
        const multicastMessage: MulticastMessage = {
            notification: {
                title: title,
                body: body
            },
            data: {
                type: NotificationType.APPOINTMENT,
                schoolId: `${appointment.school.id}`,
                appointmentId: `${appointment.id}`
            },
            tokens: [subscription.user.notificationToken]
        }
        const tokensToDelete: string[] = [];
        try {
            const batchResponse: BatchResponse = await getMessaging().sendEachForMulticast(multicastMessage, process.env.ENV != "prod");
            Logger.debug(batchResponse);
            batchResponse.responses.forEach((response: SendResponse, index: number) => {
                if (!response.success) {
                    tokensToDelete.push(subscription.user.notificationToken);
                }
            });
        } catch (e: any) {
            Logger.error("Firebase sendEachForMulticast error", e);
        }

        this.userRepository.clearNotificationTokens(tokensToDelete);
    }
}
