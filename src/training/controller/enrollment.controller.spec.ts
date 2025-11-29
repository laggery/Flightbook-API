import { EnrollmentFacade } from '../enrollment/enrollment.facade';
import { EnrollmentController } from './enrollment.controller';

describe('Enrollment Controller', () => {
  let controller: EnrollmentController;
  let facade: jest.Mocked<EnrollmentFacade>;

  beforeAll(async () => {
    facade = {} as any;
    controller = new EnrollmentController(facade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
