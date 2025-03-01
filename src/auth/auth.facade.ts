import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { EmailBodyDto } from '../email/email-body-dto';
import { EmailService } from '../email/email.service';
import { OAuth2Client } from 'google-auth-library';
import { UserFacade } from '../user/user.facade';
import { LoginType } from '../user/login-type';
import { UserAlreadyExistsException } from '../user/exception/user-already-exists-exception';

@Injectable()
export class AuthFacade {
    constructor(
        private userRepository: UserRepository,
        private userFacade: UserFacade,
        private authService: AuthService,
        private emailService: EmailService
    ) { }

    async login(user: User) {
        return this.authService.login(user);
    }

    async refresh(refreshToken: string) {
        const user: User = await this.userRepository.getUserByToken(refreshToken);
        if (user) {
            return this.authService.login(user);
        }
        return null;
    }

    async logout(token: any) {
        const user: User = await this.userRepository.getUserById(token.userId);
        user.clearToken();
        user.clearNotificationToken();
        await this.userRepository.saveUser(user);
    }

    async resetPassword(email) {
        if (!new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').test(email)) {
            return;
        }

        const user = await this.userRepository.getUserByEmail(email);

        if (!user || user?.loginType != LoginType.LOCAL || !user.enabled) {
            return;
        }

        const newPassword = Math.random().toString(36).slice(-8);
        user.password = await this.authService.hashPassword(newPassword);
        user.passwordRequestedAt = new Date();
        await this.userRepository.saveUser(user);

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

    async googleLogin(token: string) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            const payload = ticket.getPayload();

            const user = await this.userRepository.getUserByEmail(payload.email);

            if (user) {
                if (LoginType.GOOGLE == user.loginType && user.socialloginId == payload.sub && user.enabled) {
                    return this.authService.login(user)
                } else {
                    throw new UserAlreadyExistsException();
                }
            } else {
                const createdUser = await this.userFacade.createSocialLoginUser({
                    firstname: payload.given_name,
                    lastname: payload.family_name,
                    email: payload.email,
                    phone: null,
                    password: null
                }, LoginType.GOOGLE, payload.sub);

                return this.authService.login(createdUser)
            }
        } catch (exception) {
            throw new UnauthorizedException();
        }
    }
}
