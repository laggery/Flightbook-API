import { GliderRepository } from './glider.repository';
import { TestBed } from '@automock/jest';

describe('Glider Repository', () => {
  let gliderRepository: GliderRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(GliderRepository).compile();

    gliderRepository = unit;
  });

  it('should be defined', () => {
    expect(gliderRepository).toBeDefined();
  });
});
