import { SubscriptionFacade } from './subscription.facade';

describe('SubscriptionFacade', () => {
  let facade: SubscriptionFacade;

  beforeAll(async () => {
    facade = new SubscriptionFacade();
  });
  
  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
