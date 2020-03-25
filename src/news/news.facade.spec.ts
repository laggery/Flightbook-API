import { Test, TestingModule } from '@nestjs/testing';
import { NewsFacade } from './news.facade';

describe('NewsFacade', () => {
  let provider: NewsFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsFacade],
    }).compile();

    provider = module.get<NewsFacade>(NewsFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
