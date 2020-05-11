import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserWriteDto } from './interface/user-write-dto';
import { User } from './user.entity';
import { UserAlreadyExistsException } from './exception/user-already-exists-exception';
import { InvalidUserException } from './exception/invalid-user-exception';
import { plainToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { UserReadDto } from './interface/user-read-dto';
import { UserPasswordWriteDto } from './interface/user -password-write-dto';
import { InvalidPasswordException } from './exception/invalid-password-exception';
import { InvalidOldPasswordException } from './exception/invalid-oldpassword-exception';

@Injectable()
export class UserFacade {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    async getCurrentUser(id: number): Promise<any> {
        let user: User = await this.userService.getUserById(id);
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
        user.username = user.email;
        user.username_canonical = user.email;
        user.email_canonical = user.email;
        user.enabled = true;
        user.password = await this.authService.hashPassword(user.password);
        user.roles = 'a:0:{}';

        const userResp: User = await this.userService.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }

    async updateUser(id: number, userWriteDto: UserWriteDto): Promise<any> {
        if (!userWriteDto.email || !userWriteDto.firstname || !userWriteDto.lastname) {
            throw new InvalidUserException();
        }

        let userExist: User = await this.userService.getUserByEmail(userWriteDto.email);
        if (userExist) {
            throw new UserAlreadyExistsException();
        }

        let user: User = await this.userService.getUserById(id);

        user.username = userWriteDto.email;
        user.username_canonical = userWriteDto.email;
        user.email_canonical = userWriteDto.email;
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

        let user: User = await this.userService.getUserById(id);

        const validatedUser = await this.authService.validateUser(user.email, userPasswordWriteDto.oldPassword);
        if (!validatedUser) {
            throw new InvalidOldPasswordException();
        }

        user.password = await this.authService.hashPassword(userPasswordWriteDto.newPassword);

        const userResp: User = await this.userService.saveUser(user);
        return plainToClass(UserReadDto, userResp);
    }
}
