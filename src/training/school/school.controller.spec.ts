import { SchoolController } from './school.controller';
import { SchoolFacade } from './school.facade';
import { TestBed } from '@automock/jest';

describe('SchoolController', () => {
  let controller: SchoolController;
  let facade: jest.Mocked<SchoolFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(SchoolController).compile();

    controller = unit;
    facade = unitRef.get(SchoolFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
