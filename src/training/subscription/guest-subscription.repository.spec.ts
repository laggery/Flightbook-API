import { TestBed } from '@automock/jest';
import { GuestSubscriptionRepository } from './guest-subscription.repository';

describe('GuestSubscription Repository', () => {
  let guestSubscriptionRepository: GuestSubscriptionRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(GuestSubscriptionRepository).compile();

    guestSubscriptionRepository = unit;
  });

  it('should be defined', () => {
    expect(guestSubscriptionRepository).toBeDefined();
  });
});
