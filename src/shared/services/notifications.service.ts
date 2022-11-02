import { Injectable, Logger } from '@nestjs/common';
import { initializeApp, cert } from "firebase-admin/app";
import * as moment from 'moment';
import { BatchResponse, getMessaging, MulticastMessage, SendResponse } from 'firebase-admin/messaging';
import { UserService } from 'src/user/user.service';
import { Student } from 'src/training/student/student.entity';

@Injectable()
export class NotificationsService {
    constructor(private userService: UserService) {
        const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);
        initializeApp({
            credential: cert(firebaseCredentials)
        });
    }

    async sendNewAppointment(students: Student[], appointment, i18n) {

        const tokens = students.filter((student: Student) => student.user.notificationToken)
            .map((student: Student) => student.user.notificationToken);

        if (tokens.length == 0) {
            Logger.debug("no notification to send");
            return
        }

        const body = i18n.t('notification.appointment.new.body', {
            args: {
                school: appointment.school.name,
                date: moment(appointment.scheduling).format('DD.MM.YYYY HH:mm'),
                meetingPoint: appointment.meetingPoint
            }
        });
        const multicastMessage: MulticastMessage = {
            notification: {
                title: i18n.t('notification.appointment.new.title'),
                body: body,
                imageUrl: "https://raw.githubusercontent.com/laggery/Flightbook-MobileApp/master/src/assets/icons/icon-512x512.png"
            },
            tokens: tokens
        }
        const tokensToDelete: string[] = [];
        try {
            const batchResponse: BatchResponse = await getMessaging().sendMulticast(multicastMessage, process.env.ENV != "prod");
            Logger.debug(batchResponse);
            batchResponse.responses.forEach((response: SendResponse, index: number) => {
                if (!response.success) {
                    tokensToDelete.push(tokens[index]);
                }
            });
        } catch (e: any) {
            Logger.error("Firebase sendMulticast error", e);
        }

        this.userService.clearNotificationTokens(tokensToDelete);
    }
}
