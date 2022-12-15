import { Test, TestingModule } from '@nestjs/testing';
import { PaymentFacade } from './payment-facade';

describe('PaymentFacade', () => {
  let provider: PaymentFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentFacade],
    }).compile();

    provider = module.get<PaymentFacade>(PaymentFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
