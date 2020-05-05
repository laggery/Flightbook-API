import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserWriteDto } from './interface/user-write-dto';
import { User } from './user.entity';
import { UserAlreadyExistsException } from './exception/user-already-exists-exception';
import { InvalidUserException } from './exception/invalid-user-exception';
import { plainToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { UserReadDto } from './interface/user-read-dto';

@Injectable()
export class UserFacade {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

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
}
