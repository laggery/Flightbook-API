import { Injectable } from '@nestjs/common';
import { EmailBodyDto } from './email-body-dto';

import * as nodemailer from 'nodemailer';
import { SchoolDto } from 'src/training/school/interface/school-dto';
import { Appointment } from 'src/training/appointment/appointment.entity';
import moment = require('moment');
import { Subscription } from 'src/training/subscription/subscription.entity';
import { I18nContext } from 'nestjs-i18n';
import { Student } from 'src/training/student/student.entity';

@Injectable()
export class EmailService {

    constructor() {
    }

    async sendEmail(body: EmailBodyDto): Promise<any> {
        if (process.env.ENV != "dev" && process.env.ENV != "prod") {
            console.info("block sending email");
            console.debug("body: " + body.toString());
            return true;
        }
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: true,
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASSWORD,
            },
            logger: false,
        });

        try {
            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: body.toAddress,
                subject: body.subject,
                html: body.content
            });
        } catch (err) {
            console.log(err);
            throw err;
        }

        transporter.close();
        return true;
    }

    sendNewAppointment(students: Student[], appointment: Appointment, i18n: I18nContext) {
        if (students.length <= 0) {
            return;
        }

        const email = new EmailBodyDto();
        email.toAddress = "";
        students.forEach((student: Student) => {
            email.toAddress += student.user.email + ";"
        });

        email.subject = i18n.t('email.appointment.new.subject', {
            args: { 
                school: appointment.school.name,
                date: moment(appointment.scheduling).format('DD.MM.YYYY HH:mm')
            }
        });
        let description = appointment.description || "-";
        description = description.replace(new RegExp("[\r\n]", "gm"), "</br>");
        const maxPeople = appointment.maxPeople || "-";
        email.content = i18n.t('email.appointment.new.content', {
            args: {
                date: moment(appointment.scheduling).format('DD.MM.YYYY HH:mm'),
                meetingPoint: appointment.meetingPoint,
                description: description,
                maxPeople: maxPeople
            }
        });

        this.sendEmail(email);
    }

    sendUnsubscribeEmail(school: SchoolDto, appointment: Appointment, subscription: Subscription, i18n: I18nContext) {
        const email = new EmailBodyDto();
        email.toAddress = school.email;
        email.subject = i18n.t('email.appointment.unsubscribe.subject', {
            args: { 
                name: `${subscription.user.firstname} ${subscription.user.lastname}`,
                date: moment(appointment.scheduling).format('DD.MM.YYYY HH:mm')
            }
        });
        email.content = i18n.t('email.appointment.unsubscribe.content', {
            args: { 
                name: `${subscription.user.firstname} ${subscription.user.lastname}`,
                date: moment(appointment.scheduling).format('DD.MM.YYYY HH:mm')
            }
        });

        this.sendEmail(email);
    }
}
