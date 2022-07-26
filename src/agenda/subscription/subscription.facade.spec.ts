import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionFacade } from './subscription.facade';

describe('SubscriptionFacade', () => {
  let provider: SubscriptionFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionFacade],
    }).compile();

    provider = module.get<SubscriptionFacade>(SubscriptionFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
