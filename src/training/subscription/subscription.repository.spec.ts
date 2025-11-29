import { SubscriptionRepository } from './subscription.repository';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

describe('Subscription Repository', () => {
  let subscriptionRepository: SubscriptionRepository;

  beforeAll(async () => {
    const repository = {} as Repository<Subscription>;
    subscriptionRepository = new SubscriptionRepository(repository);
  });

  it('should be defined', () => {
    expect(subscriptionRepository).toBeDefined();
  });
});
