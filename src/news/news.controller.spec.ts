import { NewsController } from './news.controller';
import { NewsFacade } from './news.facade';
import { Testdata } from '../../test/testdata';

describe('News Controller', () => {
  let controller: NewsController;
  let newsFacade: jest.Mocked<NewsFacade>;

  beforeAll(async () => {
    newsFacade = {
      getNews: jest.fn(),
    } as any;
    controller = new NewsController(newsFacade);
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
