import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionFacade } from './subscription.facade';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]), 
  ],
  controllers: [],
  providers: [SubscriptionFacade, SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
