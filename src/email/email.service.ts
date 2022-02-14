import { Injectable } from '@nestjs/common';
import { EmailBodyDto } from './email-body-dto';

import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    constructor() {
    }

    async sendEmail(body: EmailBodyDto): Promise<any> {
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
}
