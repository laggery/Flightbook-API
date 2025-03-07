import { HttpException, Injectable, Logger } from '@nestjs/common';
import { EmailBodyDto } from './email-body-dto';

import * as nodemailer from 'nodemailer';
import { SchoolDto } from '../training/school/interface/school-dto';
import { Appointment } from '../training/appointment/appointment.entity';
import moment = require('moment');
import { Subscription } from '../training/subscription/subscription.entity';
import { I18nContext } from 'nestjs-i18n';
import { Student } from '../training/student/student.entity';
import { Enrollment } from '../training/enrollment/enrollment.entity';
import { env } from 'process';
import { User } from '../user/user.entity';

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
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            logger: false,
        });

        try {
            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: body.toAddress,
                bcc: body.bccAddress,
                subject: body.subject,
                html: body.content,
                replyTo: body.replyTo
            });
        } catch (err) {
            Logger.error("Error sending email", err);
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
        email.replyTo = appointment.instructor? appointment.instructor.email : appointment.school.email;
        email.bccAddress = "";
        students.forEach((student: Student) => {
            email.bccAddress += student.user.email + ";"
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
        const type = email.content = i18n.t('email.appointment.type', { lang: appointment.school.language});
        email.content = i18n.t('email.appointment.new.content', {
            lang: appointment.school.language,
            args: {
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm'),
                type: appointment.type ? `<li>${type}: ${appointment.type.name}</li>` : "",
                meetingPoint: appointment.meetingPoint || "-",
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
        email.replyTo = appointment.instructor? appointment.instructor.email : appointment.school.email;
        email.bccAddress = "";
        students.forEach((student: Student) => {
            email.bccAddress += student.user.email + ";"
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
        const type = email.content = i18n.t('email.appointment.type', { lang: appointment.school.language});
        email.content = i18n.t('email.appointment.subscription.content', {
            lang: appointment.school.language,
            args: {
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm'),
                type: appointment.type ? `<li>${type}: ${appointment.type.name}</li>` : "",
                meetingPoint: appointment.meetingPoint || "-",
                description: description,
                maxPeople: maxPeople
            }
        });

        this.sendEmail(email);
    }

    sendUnsubscribeEmail(school: SchoolDto, appointment: Appointment, subscription: Subscription) {
        if (!appointment.instructor) {
            return;
        }
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
        const type = i18n.t('email.appointment.type', { lang: appointment.school.language});
        email.content = i18n.t('email.appointment.informWaitingStudent.content', {
            lang: school.language,
            args: {
                date: moment(appointment.scheduling).utc().format('DD.MM.YYYY HH:mm'),
                type: appointment.type ? `<li>${type}: ${appointment.type.name}</li>` : "",
                meetingPoint: appointment.meetingPoint || "-",
                description: description,
                maxPeople: maxPeople
            }
        });

        this.sendEmail(email);
    }

    async sendEmailVerification(email: string, token: string, language: string): Promise<void> {
        const i18n = I18nContext.current();
        const verificationLink = `${process.env.MOBILE_APP_URL}/login?token=${token}`;
        const emailBody = new EmailBodyDto();
        emailBody.toAddress = email;
        emailBody.subject = i18n.t('email.verification.subject', { lang: language });
        emailBody.content = `
            <h1>${i18n.t('email.verification.welcome', { lang: language })}</h1>
            <p>${i18n.t('email.verification.verify_prompt', { lang: language })}</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>${i18n.t('email.verification.link_expiry', { lang: language })}</p>
        `;
        
        await this.sendEmail(emailBody);
    }

    async sendWelcomeEmail(user: User, language: string): Promise<void> {
        const i18n = I18nContext.current();
        const emailBody = new EmailBodyDto();
        emailBody.toAddress = user.email;
        emailBody.subject = i18n.t('email.welcome.subject', { lang: language });
        emailBody.content = i18n.t('email.welcome.content', { lang: language });
        
        await this.sendEmail(emailBody);
    }

    sendInvoiceUpcoming(user: User) {
        const i18n = I18nContext.current();
        const email = new EmailBodyDto();

        email.toAddress = user.email;
        email.subject = "Bevorstehende Rechnung / Prochaine facture"
        email.content = `<p>Guten Tag</p>
        <p>Ihr Abonnement wird in 30 Tagen automatisch verlängert. Sie werden mit einem Betrag von CHF 12.- belastet.</p>
        <p>Das Abonnement kann jederzeit in der Applikation unter \"Einstellungen\" gekündet werden.</p>
        <p>Wir würden uns freuen, Sie auch in Zukunft zu unseren Kunden zählen zu können.</p>
        <p>Freundliche Grüsse</br>
        Flightbook Team</p>
        <p>------------------------------------</p>
        <p>Bonjour</p>
        <p>Votre abonnement sera automatiquement renouvelé dans 30 jours. Vous serez débité d'un montant de 12.- CHF.</p>
        <p>Vous pouvez résilier votre abonnement à tout moment dans l'application sous \"Paramètres\".</p>
        <p> Nous serions heureux de continuer à pouvoir vous compter parmi nos clients à l'avenir.</p>
        <p>Salutations</br>
        Equipe Flightbook</p>`
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
