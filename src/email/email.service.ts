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
import { env } from 'process';

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
        const i18n = I18nContext.current();
        const emailBody = new EmailBodyDto();
        emailBody.toAddress = enrollment.email;
        emailBody.subject = i18n.t('email.enrollment.student.subject', { lang: enrollment.school.language });
        emailBody.content = i18n.t('email.enrollment.student.content', {
            lang: enrollment.school.language,
            args: {
                school: enrollment.school.name,
                link: `${origin}/enrollments/${enrollment.token}`,
                date: moment(enrollment.expireAt).utc().format('DD.MM.YYYY HH:mm')
            }
        });

        try {
            await this.sendEmail(emailBody);
        } catch (e) {
            throw new HttpException("Email service is unavailable", 503);
        }
    }

    async sendTeamMemberEnrollement(enrollment: Enrollment, origin: string) {
        const i18n = I18nContext.current();
        const emailBody = new EmailBodyDto();
        emailBody.toAddress = enrollment.email;
        emailBody.subject = i18n.t('email.enrollment.teamMember.subject', {
            lang: enrollment.school.language,
            args: {
                school: enrollment.school.name
            }
        });
        emailBody.content = i18n.t('email.enrollment.teamMember.content', {
            lang: enrollment.school.language,
            args: {
                school: enrollment.school.name,
                link: `${origin}/enrollments/${enrollment.token}`,
                date: moment(enrollment.expireAt).utc().format('DD.MM.YYYY HH:mm')
            }
        });
        
        try {
            await this.sendEmail(emailBody);
        } catch (e) {
            throw new HttpException("Email service is unavailable", 503);
        }
    }

    sendNewAppointment(students: Student[], appointment: Appointment) {
        if (students.length <= 0) {
            return;
        }

        const email = new EmailBodyDto();
        email.toAddress = "";
        students.forEach((student: Student) => {
            email.toAddress += student.user.email + ";"
        });

        const i18n = I18nContext.current();

        email.subject = i18n.t('email.appointment.new.subject', {
            lang: appointment.school.language,
            args: { 
                school: appointment.school.name,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm')
            }
        });
        let description = appointment.description || "-";
        description = description.replace(new RegExp("[\r\n]", "gm"), "</br>");
        const maxPeople = appointment.maxPeople || "-";
        email.content = i18n.t('email.appointment.new.content', {
            lang: appointment.school.language,
            args: {
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm'),
                meetingPoint: appointment.meetingPoint,
                description: description,
                maxPeople: maxPeople
            }
        });

        this.sendEmail(email);
    }

    sendAppointmentSubscription(students: Student[], appointment: Appointment) {
        if (students.length <= 0) {
            return;
        }

        const email = new EmailBodyDto();
        email.toAddress = "";
        students.forEach((student: Student) => {
            email.toAddress += student.user.email + ";"
        });

        const i18n = I18nContext.current();

        email.subject = i18n.t('email.appointment.subscription.subject', {
            lang: appointment.school.language,
            args: { 
                school: appointment.school.name,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm')
            }
        });
        let description = appointment.description || "-";
        description = description.replace(new RegExp("[\r\n]", "gm"), "</br>");
        const maxPeople = appointment.maxPeople || "-";
        email.content = i18n.t('email.appointment.subscription.content', {
            lang: appointment.school.language,
            args: {
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm'),
                meetingPoint: appointment.meetingPoint,
                description: description,
                maxPeople: maxPeople
            }
        });

        this.sendEmail(email);
    }

    sendUnsubscribeEmail(school: SchoolDto, appointment: Appointment, subscription: Subscription) {
        const i18n = I18nContext.current();
        const email = new EmailBodyDto();

        email.toAddress = appointment.instructor.email;
        email.subject = i18n.t('email.appointment.unsubscribe.subject', {
            lang: school.language,
            args: { 
                name: `${subscription.user.firstname} ${subscription.user.lastname}`,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm')
            }
        });
        email.content = i18n.t('email.appointment.unsubscribe.content', {
            lang: school.language,
            args: { 
                name: `${subscription.user.firstname} ${subscription.user.lastname}`,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm')
            }
        });

        this.sendEmail(email);
    }

    sendInformWaitingStudent(school: SchoolDto, appointment: Appointment, subscription: Subscription) {
        const i18n = I18nContext.current();
        const email = new EmailBodyDto();

        email.toAddress = subscription.user.email;
        email.subject = i18n.t('email.appointment.informWaitingStudent.subject', {
            lang: school.language,
            args: { 
                school: school.name,
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm')
            }
        });
        let description = appointment.description || "-";
        description = description.replace(new RegExp("[\r\n]", "gm"), "</br>");
        const maxPeople = appointment.maxPeople || "-";
        email.content = i18n.t('email.appointment.informWaitingStudent.content', {
            lang: school.language,
            args: {
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm'),
                meetingPoint: appointment.meetingPoint,
                description: description,
                maxPeople: maxPeople
            }
        });

        this.sendEmail(email);
    }

    sendErrorMessageToAdmin(subject: string, content: string) {
        const email = new EmailBodyDto();
        email.toAddress = env.EMAIL_FROM;
        email.subject = subject;
        email.content = content;

        this.sendEmail(email);
    }
}
