import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestSubscription } from './guest-subscription.entity';

@Injectable()
export class GuestSubscriptionRepository extends Repository<GuestSubscription> {

    constructor(
        @InjectRepository(GuestSubscription)
        private readonly repository: Repository<GuestSubscription>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
