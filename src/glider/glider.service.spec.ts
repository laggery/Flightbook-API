import { Test, TestingModule } from '@nestjs/testing';
import { GliderService } from './glider.service';

describe('GliderService', () => {
  let service: GliderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GliderService],
    }).compile();

    service = module.get<GliderService>(GliderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
