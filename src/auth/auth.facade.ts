import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './service/auth.service';
import { EmailBodyDto } from '../email/email-body-dto';
import { EmailService } from '../email/email.service';
import { OAuth2Client } from 'google-auth-library';
import { UserFacade } from '../user/user.facade';
import { LoginType } from '../user/login-type';
import { UserAlreadyExistsException } from '../user/exception/user-already-exists-exception';
import { LoginDto } from './interface/login-dto';
import { KeycloakService } from './service/keycloak.service';

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
        let user = await this.userRepository.getUserByEmail(loginDto.email);
        if (user?.confirmationToken) {
            throw new UnauthorizedException('account not validated');
        }

        if (!user?.enabled) {
            throw new UnauthorizedException('account disabled');
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
                const keycloakUserId = await this.keycloakService.createUser(validatedUser, loginDto.password, true);
                validatedUser.keycloakId = keycloakUserId;
            }
            user = await this.userRepository.saveUser(validatedUser);
        }
        let keycloakLoginData = await this.keycloakService.login(loginDto.email, loginDto.password);
        const previousLogin = user.lastLogin;
        user.lastLogin = new Date();
        await this.userRepository.saveUser(user);

        if (!previousLogin && !user.paymentExempted && user.validatedAt.toISOString() !== user.createdAt.toISOString()) {
            this.emailService.sendWelcomeEmail(user, language);
        }

        keycloakLoginData.lastLogin = previousLogin;

        return keycloakLoginData;
    }

    async refresh(refreshToken: string, language: string) {
        // Check if refresh token is legacy token
        if (refreshToken?.length <= 36) {
            const user: User = await this.userRepository.getUserByToken(refreshToken);
            if (user) {
                return this.authService.login(user, language);
            }
        }

        return await this.keycloakService.refreshToken(refreshToken);
    }

    async logout(token: any, refreshToken: string) {
        if (refreshToken && refreshToken.length > 36) {
            await this.keycloakService.logout(refreshToken);
        }
        
        const user: User = await this.userRepository.getUserById(token.userId);
        user.clearToken();
        user.clearNotificationToken();
        await this.userRepository.saveUser(user);
    }

    async resetPassword(email: string): Promise<void> {
        if (!new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').test(email)) {
            return;
        }

        const user = await this.userRepository.getUserByEmail(email);

        if (!user || !user.enabled) {
            return;
        }

        const newPassword = Math.random().toString(36).slice(-8);

        if (user.keycloakId) {
            await this.keycloakService.changePassword(user, newPassword);
        } else {
            // Check if user exists in keycloak and create if not
            const keycloakUser = await this.keycloakService.getUserByEmail(user.email);
            if (keycloakUser) {
                user.keycloakId = keycloakUser.id;
                await this.keycloakService.changePassword(user, newPassword);
            } else {
                const keycloakUserId = await this.keycloakService.createUser(user, newPassword, true);
                user.keycloakId = keycloakUserId;
            }
        }

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
