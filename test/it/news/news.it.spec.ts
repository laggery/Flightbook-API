import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { News } from '../../../src/news/news.entity';
import { NewsModule } from '../../../src/news/news.module';
import { NewsRepository } from '../../../src/news/news.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbTestConfig } from '../db-test-config';

describe('NewsRepository', () => {
  let newsRepository: NewsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbTestConfig),
        NewsModule

      ],
    })
      .compile();
    moduleRef.useLogger(new Logger());
    newsRepository = moduleRef.get(NewsRepository);
  });

  beforeEach(async () => {
    newsRepository.clear();
  });


  it('Should get news', async () => {
    // given - team name
    const news = new News();
    news.date = '01.01.2024';
    news.title = 'title';
    news.text = 'text';
    news.language = 'de';

    await newsRepository.save(news);

    //when
    const newsList = await newsRepository.getNews('de');

    //then
    expect(newsList).toHaveLength(1);

    expect(newsList[0].date).toBe('2024-01-01');
    expect(newsList[0].title).toBe('title');
    expect(newsList[0].text).toBe('text');
    expect(newsList[0].language).toBe('de');
  });
});
