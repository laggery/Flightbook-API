import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NewsModule } from '../../../src/news/news.module';
import { NewsRepository } from '../../../src/news/news.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbTestConfig } from '../db-test-config';
import { TestUtil } from '../../test.util';

describe('NewsRepository', () => {
  let newsRepository: NewsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbTestConfig),
        NewsModule
      ]
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
    const news = TestUtil.createNews('de');

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
