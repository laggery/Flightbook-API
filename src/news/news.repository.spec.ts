import { NewsRepository } from './news.repository';
import { Testdata } from '../../test/testdata';
import { Repository } from 'typeorm';
import { News } from './news.entity';

describe('NewsRepository', () => {
  let newsRepository: NewsRepository;

  beforeAll(async () => {
    const repository = {} as Repository<News>;
    newsRepository = new NewsRepository(repository);
  });

  it('Should get news', async () => {
    // given - team name
    const mockNews = Testdata.createNews('de');

    const findSpy = jest
        .spyOn(newsRepository, 'find')
        .mockResolvedValue([mockNews]);

    // repository.find.mockResolvedValue([mockNews]);

    //when
    const newsList = await newsRepository.getNews('de');

    //then
    expect(newsList).toHaveLength(1);
    expect(newsList[0]).toEqual(mockNews);
    expect(findSpy).toHaveBeenCalledWith({
      where: {
          language: 'de'
      },
      order: {
          date: 'DESC'
      }
  });
  });
});
