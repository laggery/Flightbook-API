import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {

    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getUserById(id: number): Promise<User> {
        return this.findOneByOrFail({id: id});
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        if (!email) {
            return undefined;
        }
        return this.findOne({ where: {
            email: ILike(email)
        } });
    }

    async getUserByToken(token: string): Promise<User | undefined> {
        if (!token) {
            return undefined;
        }
        return this.findOneBy({ token: token });
    }

    async getUserByNotificationToken(notificationToken: string): Promise<User | undefined> {
        if (!notificationToken) {
            return undefined;
        }
        return this.findOneBy({ notificationToken: notificationToken });
    }

    async getUserByKeycloakId(keycloakId: string): Promise<User | undefined> {
        if (!keycloakId) {
            return undefined;
        }
        return this.findOneBy({ keycloakId: keycloakId });
    }

    async getUserByConfirmationToken(token: string): Promise<User | undefined> {
        if (!token) {
            return undefined;
        }
        return this.findOne({ 
            where: { confirmationToken: token }
        });
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
        return this.save(user);
    }
}
