import { Test, TestingModule } from '@nestjs/testing';
import { GliderRepository } from './glider.repository';

describe('GliderService', () => {
  let service: GliderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GliderRepository],
    }).compile();

    service = module.get<GliderRepository>(GliderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
