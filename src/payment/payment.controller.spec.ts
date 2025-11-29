import { PaymentController } from './payment.controller';
import { PaymentFacade } from './payment-facade';

describe('PaymentController', () => {
  let controller: PaymentController;
  let facade: jest.Mocked<PaymentFacade>;

  beforeAll(async () => {
    facade = {} as any;
    controller = new PaymentController(facade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
