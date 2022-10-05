import { Injectable } from '@nestjs/common';
import { EmailBodyDto } from './email-body-dto';

import * as nodemailer from 'nodemailer';
import { StudentDto } from 'src/training/student/interface/student-dto';
import { SchoolDto } from 'src/training/school/interface/school-dto';
import { Appointment } from 'src/training/appointment/appointment.entity';
import moment = require('moment');
import { Subscription } from 'src/training/subscription/subscription.entity';

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

    sendAppointmentEmail(students: StudentDto[], appointment: Appointment) {
        if (students.length <= 0) {
            return;
        }

        const email = new EmailBodyDto();
        email.toAddress = "";
        students.forEach((student: StudentDto) => {
            email.toAddress += student.user.email + ";"
        });

        email.subject = `${appointment.school.name}: New appointment on ${moment(appointment.scheduling).format('DD.MM.YYYY HH:mm')}`;
        let description = appointment.description || "-";
        description = description.replace(new RegExp("[\r\n]", "gm"), "</br>");
        const maxPeople = appointment.maxPeople || "-";
        email.content = `<p>Appointment information</p>
        <ul>
            <li>Date: ${moment(appointment.scheduling).format('DD.MM.YYYY HH:mm')}</li>
            <li>Meeting point: ${appointment.meetingPoint}</li>
            <li>Description: ${description}</li>
            <li>Max participants: ${maxPeople}</li>
        </ul>`;

        this.sendEmail(email);
    }

    sendUnsubscribeEmail(school: SchoolDto, subscription: Subscription) {
        const email = new EmailBodyDto();
        email.toAddress = school.email;
        email.subject = `${subscription.user.firstname} ${subscription.user.lastname} has cancelled participation`;
        email.content = `<p>${subscription.user.firstname} ${subscription.user.lastname} has cancelled participation</p>`

        this.sendEmail(email);
    }
}
