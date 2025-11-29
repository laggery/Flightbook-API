import { Repository } from 'typeorm';
import { GuestSubscription } from './guest-subscription.entity';
import { GuestSubscriptionRepository } from './guest-subscription.repository';

describe('GuestSubscription Repository', () => {
  let guestSubscriptionRepository: GuestSubscriptionRepository;

  beforeAll(async () => {
    const repository = {} as Repository<GuestSubscription>;
    guestSubscriptionRepository = new GuestSubscriptionRepository(repository);
  });

  it('should be defined', () => {
    expect(guestSubscriptionRepository).toBeDefined();
  });
});
