import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async getUserById(id: number): Promise<User> {
        return this.userRepository.findOneByOrFail({id: id});
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: {
            email: ILike(email)
        } });
    }

    async getUserByToken(token: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ token: token });
    }

    async getUserByNotificationToken(notificationToken: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ notificationToken: notificationToken });
    }

    async clearNotificationTokens(tokens: string[]) {
        tokens.forEach(async (token: string) => {
            const user = await this.getUserByNotificationToken(token);
            if (user) {
                user.clearNotificationToken();
                this.saveUser(user);
            }
        });
        
    }

    async saveUser(user: User): Promise<User | undefined> {
        user.email = user.email.toLowerCase();
        return this.userRepository.save(user);
    }
}
