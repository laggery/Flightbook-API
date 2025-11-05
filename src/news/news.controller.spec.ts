import { NewsController } from './news.controller';
import { NewsFacade } from './news.facade';
import { TestBed } from '@automock/jest';
import { Testdata } from '../../test/testdata';

describe('News Controller', () => {
  let controller: NewsController;
  let newsFacade: jest.Mocked<NewsFacade>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(NewsController).compile();

    controller = unit;
    newsFacade = unitRef.get(NewsFacade);
  });

  it('Should get news', async () => {
    // given - team name
    const mockNews = Testdata.createNews('de');

    newsFacade.getNews.mockResolvedValue([mockNews]);

    //when
    const newsList = await controller.getNews('de');

    //then
    expect(newsFacade.getNews).toHaveBeenCalled();
    expect(newsList).toHaveLength(1);
    expect(newsList[0]).toEqual(mockNews);
  });
});
