import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserWriteDto } from './interface/user-write-dto';
import { User } from './user.entity';
import { UserAlreadyExistsException } from './exception/user-already-exists-exception';
import { InvalidUserException } from './exception/invalid-user-exception';
import { plainToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { UserReadDto } from './interface/user-read-dto';
import { UserPasswordWriteDto } from './interface/user-password-write-dto';
import { InvalidPasswordException } from './exception/invalid-password-exception';
import { InvalidOldPasswordException } from './exception/invalid-oldpassword-exception';
import { LoginType } from './login-type';

@Injectable()
export class UserFacade {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    async getCurrentUser(id: number): Promise<any> {
        const user: User = await this.userService.getUserById(id);
        return plainToClass(UserReadDto, user);
    }

    async createUser(userWriteDto: UserWriteDto): Promise<any> {
        if (!userWriteDto.email || !userWriteDto.firstname || !userWriteDto.lastname || !userWriteDto.password) {
            throw new InvalidUserException();
        }

        let user: User = await this.userService.getUserByEmail(userWriteDto.email);
        if (user) {
            throw new UserAlreadyExistsException();
        }

        user = plainToClass(User, userWriteDto);
        user.password = await this.authService.hashPassword(user.password);
        user.loginType = LoginType.LOCAL;

        const userResp: User = await this.userService.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    async createSocialLoginUser(userWriteDto: UserWriteDto, loginType: LoginType, socialLoginId: string): Promise<any> {
        if (!userWriteDto.email || !userWriteDto.firstname || !userWriteDto.lastname) {
            throw new InvalidUserException();
        }

        const user = plainToClass(User, userWriteDto);
        user.loginType = loginType;
        user.socialloginId= socialLoginId;

        const userResp: User = await this.userService.saveUser(user);
        return userResp;
    }

    async updateUser(id: number, userWriteDto: UserWriteDto): Promise<any> {
        if (!userWriteDto.email || !userWriteDto.firstname || !userWriteDto.lastname) {
            throw new InvalidUserException();
        }

        const user: User = await this.userService.getUserById(id);

        if (user.loginType != LoginType.LOCAL){
            throw new BadRequestException();
        }

        if (user.email !== userWriteDto.email) {
            const userExist: User = await this.userService.getUserByEmail(userWriteDto.email);

            if (userExist) {
                throw new UserAlreadyExistsException();
            }
        }

        user.email = userWriteDto.email;
        user.firstname = userWriteDto.firstname;
        user.lastname = userWriteDto.lastname;

        const userResp: User = await this.userService.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    async updatePassword(id: number, userPasswordWriteDto: UserPasswordWriteDto): Promise<any> {
        if (!userPasswordWriteDto.oldPassword || !userPasswordWriteDto.newPassword) {
            throw new InvalidPasswordException();
        }

        const user: User = await this.userService.getUserById(id);

        const validatedUser = await this.authService.validateUser(user.email, userPasswordWriteDto.oldPassword);
        if (!validatedUser) {
            throw new InvalidOldPasswordException();
        }

        user.password = await this.authService.hashPassword(userPasswordWriteDto.newPassword);

        const userResp: User = await this.userService.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    async updateNotificationToken(id: number, notificationToken: string): Promise<any> {
        const user: User = await this.userService.getUserById(id);

        if (!user) {
            throw new UnauthorizedException();
        }

        // Check if notification token already exists
        const userToClean: User = await this.userService.getUserByNotificationToken(notificationToken);
        if (userToClean) {
            userToClean.clearNotificationToken();
            this.userService.saveUser(userToClean);
        }

        user.updateNotificationToken(notificationToken);

        const userResp: User = await this.userService.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    async disableUser(id: number): Promise<any> {
        const user: User = await this.userService.getUserById(id);
        user.enabled = false;
        const userResp: User = await this.userService.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }
}
