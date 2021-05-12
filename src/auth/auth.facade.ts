import { Injectable, HttpException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { EmailBodyDto } from 'src/email/email-body-dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthFacade {
    constructor(private userService: UserService, private authService: AuthService, private emailService: EmailService) { }

    async login(user: User) {
        return this.authService.login(user);
    }

    async refresh(refreshToken: string) {
        const user: User = await this.userService.getUserByToken(refreshToken);
        if (user) {
            return this.authService.login(user);
        }
        return null;
    }

    async logout(token: any) {
        const user: User = await this.userService.getUserById(token.userId);
        user.token = null;
        await this.userService.saveUser(user);
    }

    async resetPassword(email) {
        if (!new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').test(email) ) {
            return;
        }

        const user = await this.userService.getUserByEmail(email);

        if (!user) {
            return;
        }

        const newPassword = Math.random().toString(36).slice(-8);
        user.password = await this.authService.hashPassword(newPassword);
        await this.userService.saveUser(user);

        const emailBody = new EmailBodyDto();
        emailBody.toAddress = email;
        emailBody.subject = "New password";
        emailBody.content = `<p>Hello</p>
        <p>Here is your new password for your flight book </p>
        <p>Password : ${newPassword}</p>`;

        try {
            await this.emailService.sendEmail(emailBody);
        } catch (e) {
            throw new HttpException("Email service is unavailable", 503);
        }
    }
}
