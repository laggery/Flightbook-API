import { PaymentController } from './payment.controller';
import { PaymentFacade } from './payment-facade';
import { TestBed } from '@automock/jest';

describe('PaymentController', () => {
  let controller: PaymentController;
  let facade: jest.Mocked<PaymentFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(PaymentController).compile();

    controller = unit;
    facade = unitRef.get(PaymentFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
