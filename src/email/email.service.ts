import { Injectable } from '@nestjs/common';
import { EmailBodyDto } from './email-body-dto';

import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    constructor() {
    }

    async sendEmail(body: EmailBodyDto): Promise<any> {
        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: "admin@flightbook.ch",
                pass: "Team_2021",
            },
            logger: false,
        });

        try {
            const info = await transporter.sendMail({
                from: "admin@flightbook.ch",
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
}
