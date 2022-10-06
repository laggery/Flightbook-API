import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {

    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>
    ) { }

    async removeSubscription(subscription: Subscription): Promise<Subscription | undefined> {
        return await this.subscriptionRepository.remove(subscription);
    }
}
