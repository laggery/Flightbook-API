import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthFacade {
    constructor(private userService: UserService, private authService: AuthService) { }

    async login(user: User) {
        return this.authService.login(user);
    }

    async refresh(refreshToken: string) {
        let user: User = await this.userService.getUserByToken(refreshToken);
        if (user) {
            return this.authService.login(user);
        }
        return null;
    }

    async logout(token: any) {
        const user: User = await this.userService.getUserById(token.userId);
        user.token = null;
        this.userService.saveUser(user);
    }
}
