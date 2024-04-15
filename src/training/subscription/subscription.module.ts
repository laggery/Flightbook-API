import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionFacade } from './subscription.facade';
import { SubscriptionRepository } from './subscription.repository';
import { GuestSubscription } from './guest-subscription.entity';
import { GuestSubscriptionRepository } from './guest-subscription.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, GuestSubscription]), 
  ],
  controllers: [],
  providers: [SubscriptionFacade, SubscriptionRepository, GuestSubscriptionRepository],
  exports: [SubscriptionRepository, GuestSubscriptionRepository]
})
export class SubscriptionModule {}
