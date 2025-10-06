import { TestBed } from '@automock/jest';
import { NewsFacade } from './news.facade';
import { NewsRepository } from './news.repository';
import { Testdata } from '../../test/testdata';

describe('NewsFacade', () => {
  let newsFacade: NewsFacade;
  let newsRepository: jest.Mocked<NewsRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(NewsFacade).compile();

    newsFacade = unit;
    newsRepository = unitRef.get(NewsRepository);
  });

  it('Should get news', async () => {
    // given
    const mockNews = Testdata.createNews('de');

    newsRepository.getNews.mockResolvedValue([mockNews]);

    // when
    const newsList = await newsFacade.getNews('de');

    // then
    expect(newsRepository.getNews).toHaveBeenCalled();
    expect(newsList).toHaveLength(1);
    expect(newsList[0]).toEqual(mockNews);
  });
});
