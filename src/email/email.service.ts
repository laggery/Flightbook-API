import { HttpException, Injectable, Logger } from '@nestjs/common';
import { EmailBodyDto } from './email-body-dto';

import * as nodemailer from 'nodemailer';
import { SchoolDto } from 'src/training/school/interface/school-dto';
import { Appointment } from 'src/training/appointment/appointment.entity';
import moment = require('moment');
import { Subscription } from 'src/training/subscription/subscription.entity';
import { I18nContext } from 'nestjs-i18n';
import { Student } from 'src/training/student/student.entity';
import { Enrollment } from 'src/training/enrollment/enrollment.entity';

@Injectable()
export class EmailService {

    constructor() {
    }

    async sendEmail(body: EmailBodyDto): Promise<any> {
        if (process.env.ENV != "dev" && process.env.ENV != "prod") {
            Logger.log("block sending email");
            Logger.debug("body", body);
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

    async sendStudentEnrollement(enrollment: Enrollment, origin: string) {
        const emailBody = new EmailBodyDto();
        emailBody.toAddress = enrollment.email;
        emailBody.subject = "Share flightbook";
        emailBody.content = `<p>Hello</p>
        <p>${ enrollment.school.name } invite you to share your flightbook. You can accept this invitation by follow the link below.</p>
        <p>Link : ${origin}/enrollments/${enrollment.token}</p>
        <p>The link expire ${moment(enrollment.expireAt).format('DD.MM.YYYY HH:mm')}`;

        try {
            await this.sendEmail(emailBody);
        } catch (e) {
            throw new HttpException("Email service is unavailable", 503);
        }
    }

    async sendTeamMemberEnrollement(enrollment: Enrollment, origin: string) {
        const emailBody = new EmailBodyDto();
        emailBody.toAddress = enrollment.email;
        emailBody.subject = `Team member ${enrollment.school.name}`;
        emailBody.content = `<p>Hello</p>
        <p>${ enrollment.school.name } invite you to be member of his team. You can accept this invitation by follow the link below.</p>
        <p>Link : ${origin}/enrollments/${enrollment.token}</p>
        <p>The link expire ${moment(enrollment.expireAt).format('DD.MM.YYYY HH:mm')}`;

        try {
            await this.sendEmail(emailBody);
        } catch (e) {
            throw new HttpException("Email service is unavailable", 503);
        }
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

    sendAppointmentSubscription(students: Student[], appointment: Appointment, i18n: I18nContext) {
        if (students.length <= 0) {
            return;
        }

        const email = new EmailBodyDto();
        email.toAddress = "";
        students.forEach((student: Student) => {
            email.toAddress += student.user.email + ";"
        });

        email.subject = i18n.t('email.appointment.subscription.subject', {
            args: { 
                school: appointment.school.name,
                date: moment(appointment.scheduling).format('DD.MM.YYYY HH:mm')
            }
        });
        let description = appointment.description || "-";
        description = description.replace(new RegExp("[\r\n]", "gm"), "</br>");
        const maxPeople = appointment.maxPeople || "-";
        email.content = i18n.t('email.appointment.subscription.content', {
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

    sendInformWaitingStudent(school: SchoolDto, appointment: Appointment, subscription: Subscription, i18n: I18nContext) {
        console.log(appointment);
        const email = new EmailBodyDto();
        email.toAddress = subscription.user.email;
        
        email.subject = i18n.t('email.appointment.informWaitingStudent.subject', {
            args: { 
                school: school.name,
                date: moment(appointment.scheduling).format('DD.MM.YYYY HH:mm')
            }
        });
        let description = appointment.description || "-";
        description = description.replace(new RegExp("[\r\n]", "gm"), "</br>");
        const maxPeople = appointment.maxPeople || "-";
        email.content = i18n.t('email.appointment.informWaitingStudent.content', {
            args: {
                date: moment(appointment.scheduling).format('DD.MM.YYYY HH:mm'),
                meetingPoint: appointment.meetingPoint,
                description: description,
                maxPeople: maxPeople
            }
        });

        this.sendEmail(email);
    }
}
