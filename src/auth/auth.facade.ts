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
import { LoginDto } from './interface/login-dto';
import { KeycloakService } from './service/keycloak.service';
import { isUUID } from 'class-validator';

@Injectable()
export class AuthFacade {
    constructor(
        private userRepository: UserRepository,
        private userFacade: UserFacade,
        private authService: AuthService,
        private emailService: EmailService,
        private keycloakService: KeycloakService
    ) { }

    async login(loginDto: LoginDto, language: string) {
        const user = await this.userRepository.getUserByEmail(loginDto.email);
        if (user?.confirmationToken) {
            throw new UnauthorizedException('account not validated');
        }

        if (!user || !user.keycloakId) {
            // Login with legacy and create keycloak user
            const validatedUser = await this.authService.validateUser(loginDto.email, loginDto.password);
            if (!validatedUser) {
                throw new UnauthorizedException();
            }

            // Migrate user to keycloak
            const existingUser = await this.keycloakService.getUserByEmail(user.email);
            if (existingUser) {
                validatedUser.keycloakId = existingUser.id;
            } else {
                const keycloakUserId = await this.keycloakService.createUser(validatedUser, loginDto.password);
                validatedUser.keycloakId = keycloakUserId;
            }
            await this.userRepository.saveUser(validatedUser);
        }
        return this.keycloakService.login(loginDto.email, loginDto.password);
    }

    async refresh(refreshToken: string, language: string) {
        // Check if refresh token is UUID
        if (!isUUID(refreshToken)) {
            const user: User = await this.userRepository.getUserByToken(refreshToken);
            if (user) {
                return this.authService.login(user, language);
            }
        }

        return await this.keycloakService.refreshToken(refreshToken);
    }

    async logout(token: any, refreshToken: string) {
        if (refreshToken && !isUUID(refreshToken)) {
            await this.keycloakService.logout(refreshToken);
        }
        
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

    async googleLogin(token: string, language: string) {
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
                    return this.authService.login(user, language);
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

                return this.authService.login(createdUser, language);
            }
        } catch (exception) {
            throw new UnauthorizedException();
        }
    }
}
