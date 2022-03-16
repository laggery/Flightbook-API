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
        return this.userRepository.findOneOrFail(id);
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: {
            email: ILike(email)
        } });
    }

    async getUserByToken(token: string): Promise<User | undefined> {
        return this.userRepository.findOne({ token: token });
    }

    async saveUser(user: User): Promise<User | undefined> {
        user.email = user.email.toLowerCase();
        return this.userRepository.save(user);
    }
}
