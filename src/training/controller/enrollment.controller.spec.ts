import { EnrollmentFacade } from '../enrollment/enrollment.facade';
import { EnrollmentController } from './enrollment.controller';
import { TestBed } from '@automock/jest';

describe('Enrollment Controller', () => {
  let controller: EnrollmentController;
  let facade: jest.Mocked<EnrollmentFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(EnrollmentController).compile();

    controller = unit;
    facade = unitRef.get(EnrollmentFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
