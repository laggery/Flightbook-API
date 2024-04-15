import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionRepository extends Repository<Subscription> {

    constructor(
        @InjectRepository(Subscription)
        private readonly repository: Repository<Subscription>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
