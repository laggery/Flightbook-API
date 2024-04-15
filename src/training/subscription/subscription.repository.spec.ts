import { SubscriptionRepository } from './subscription.repository';
import { TestBed } from '@automock/jest';

describe('Subscription Repository', () => {
  let subscriptionRepository: SubscriptionRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(SubscriptionRepository).compile();

    subscriptionRepository = unit;
  });

  it('should be defined', () => {
    expect(subscriptionRepository).toBeDefined();
  });
});
