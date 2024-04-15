import { TestBed } from '@automock/jest';
import { GliderController } from './glider.controller';
import { GliderFacade } from './glider.facade';

describe('Glider Controller', () => {
  let controller: GliderController;
  let facade: jest.Mocked<GliderFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(GliderController).compile();

    controller = unit;
    facade = unitRef.get(GliderFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
