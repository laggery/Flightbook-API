import { Test, TestingModule } from '@nestjs/testing';
import { NewsRepository } from './news.repository';

describe('NewsService', () => {
  let service: NewsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsRepository],
    }).compile();

    service = module.get<NewsRepository>(NewsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
