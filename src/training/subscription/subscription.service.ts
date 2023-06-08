import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { GuestSubscription } from './guest-subscription.entity';

@Injectable()
export class SubscriptionService {

    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
        @InjectRepository(GuestSubscription)
        private readonly guestSubscriptionRepository: Repository<GuestSubscription>
    ) { }

    async removeSubscription(subscription: Subscription): Promise<Subscription | undefined> {
        return await this.subscriptionRepository.remove(subscription);
    }

    async removeGuestSubscription(guestSubscription: GuestSubscription): Promise<GuestSubscription | undefined> {
        return await this.guestSubscriptionRepository.remove(guestSubscription);
    }
}
