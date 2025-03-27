import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserWriteDto } from './interface/user-write-dto';
import { User } from './user.entity';
import { UserAlreadyExistsException } from './exception/user-already-exists-exception';
import { InvalidUserException } from './exception/invalid-user-exception';
import { plainToClass } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { UserReadDto } from './interface/user-read-dto';
import { UserPasswordWriteDto } from './interface/user-password-write-dto';
import { InvalidPasswordException } from './exception/invalid-password-exception';
import { InvalidOldPasswordException } from './exception/invalid-oldpassword-exception';
import { LoginType } from './login-type';
import { PaymentFacade } from '../payment/payment-facade';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';
import { UserException } from './exception/user.exception';
import { KeycloakService } from '../auth/service/keycloak.service';

@Injectable()
export class UserFacade {

    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private paymentFacade: PaymentFacade,
        private emailService: EmailService,
        private keycloakService: KeycloakService
    ) {}

    async getCurrentUser(id: number): Promise<any> {
        const user: User = await this.userRepository.getUserById(id);
        return plainToClass(UserReadDto, user);
    }

    async createUser(userWriteDto: UserWriteDto, isInstructorApp: boolean, language: string): Promise<any> {
        if (!userWriteDto.email || !userWriteDto.firstname || !userWriteDto.lastname || !userWriteDto.password) {
            throw new InvalidUserException();
        }

        let user: User = await this.userRepository.getUserByEmail(userWriteDto.email);
        if (user) {
            throw new UserAlreadyExistsException();
        }

        user = plainToClass(User, userWriteDto);
        user.email = user.email.toLowerCase();
        user.password = await this.authService.hashPassword(user.password);
        user.loginType = LoginType.LOCAL;
        user.createdAt = new Date();
        user.paymentExempted = false;
        
        const keycloakUserId = await this.keycloakService.createUser(user, userWriteDto.password, isInstructorApp);
        user.keycloakId = keycloakUserId;

        if (isInstructorApp) {
            user.validatedAt = new Date();
        } else {
            user.confirmationToken = crypto.randomBytes(32).toString('hex');
            await this.emailService.sendEmailVerification(user.email, user.confirmationToken, language);
        }

        const userResp: User = await this.userRepository.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    async verifyEmail(token: string): Promise<void> {
        const user = await this.userRepository.getUserByConfirmationToken(token);
        
        if (!user) {
            UserException.invalidEmailTokenVerificationException();
        }

        user.confirmationToken = null;
        user.validatedAt = new Date();
        if (user.keycloakId) {
            this.keycloakService.updateUser(user.keycloakId, user);
        }
        await this.userRepository.saveUser(user);
    }

    async createSocialLoginUser(userWriteDto: UserWriteDto, loginType: LoginType, socialLoginId: string): Promise<any> {
        if (!userWriteDto.email || !userWriteDto.firstname || !userWriteDto.lastname) {
            throw new InvalidUserException();
        }

        const user = plainToClass(User, userWriteDto);
        user.loginType = loginType;
        user.socialloginId = socialLoginId;

        const userResp: User = await this.userRepository.saveUser(user);
        return userResp;
    }

    async updateUser(id: number, userWriteDto: UserWriteDto): Promise<any> {
        if (!userWriteDto.email || !userWriteDto.firstname || !userWriteDto.lastname) {
            throw new InvalidUserException();
        }

        const user: User = await this.userRepository.getUserById(id);
        const oldEmail = user.email;

        if (user.loginType != LoginType.LOCAL) {
            throw new BadRequestException();
        }

        if (user.email !== userWriteDto.email) {
            const userExist: User = await this.userRepository.getUserByEmail(userWriteDto.email);

            if (userExist) {
                throw new UserAlreadyExistsException();
            }
        }

        user.email = userWriteDto.email;
        user.firstname = userWriteDto.firstname;
        user.lastname = userWriteDto.lastname;
        user.phone = userWriteDto.phone;

        const userResp: User = await this.userRepository.saveUser(user);

        if (oldEmail !== userResp.email) {
            this.paymentFacade.updatePaymentUser(userResp, oldEmail);
        }
        return plainToClass(UserReadDto, userResp);
    }

    async updatePassword(id: number, userPasswordWriteDto: UserPasswordWriteDto): Promise<any> {
        if (!userPasswordWriteDto.oldPassword || !userPasswordWriteDto.newPassword) {
            throw new InvalidPasswordException();
        }

        const user: User = await this.userRepository.getUserById(id);

        const validatedUser = await this.authService.validateUser(user.email, userPasswordWriteDto.oldPassword);
        if (!validatedUser) {
            throw new InvalidOldPasswordException();
        }

        user.password = await this.authService.hashPassword(userPasswordWriteDto.newPassword);

        const userResp: User = await this.userRepository.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    async updateNotificationToken(id: number, notificationToken: string): Promise<any> {
        const user: User = await this.userRepository.getUserById(id);

        if (!user) {
            throw new UnauthorizedException();
        }

        // Check if notification token already exists
        const userToClean: User = await this.userRepository.getUserByNotificationToken(notificationToken);
        if (userToClean && userToClean.id != id) {
            userToClean.clearNotificationToken();
            this.userRepository.saveUser(userToClean);
        }

        user.updateNotificationToken(notificationToken);

        const userResp: User = await this.userRepository.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    async disableUser(id: number): Promise<any> {
        const user: User = await this.userRepository.getUserById(id);
        user.enabled = false;
        const userResp: User = await this.userRepository.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    /**
     * Maps a User entity to a UserReadDto
     */
    mapUserToReadDto(user: User): UserReadDto {
        return plainToClass(UserReadDto, user);
    }
}
