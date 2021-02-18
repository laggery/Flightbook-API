import { Injectable, HttpService } from '@nestjs/common';
import { EmailBodyDto } from './email-body-dto';

@Injectable()
export class EmailService {
    private accountId: string

    constructor(private readonly httpService: HttpService) {
        this.httpService.get('http://mail.zoho.com/api/accounts', { headers: { "Authorization": process.env.EMAIL_AUTHORIZATION } }).subscribe(res => {
            this.accountId = res.data.data[0].accountId;
        })
    }

    sendEmail(body: EmailBodyDto): Promise<any> {
        body.fromAddress = process.env.EMAIL_FROM;
        body.mailFormat = process.env.EMAIL_FORMAT || "html";
        return this.httpService.post(`https://mail.zoho.com/api/accounts/${this.accountId}/messages`, JSON.stringify(body), { headers: { "Authorization": process.env.EMAIL_AUTHORIZATION, "content-type": "application/json" } }).toPromise();
    }
}
