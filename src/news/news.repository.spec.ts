import { NewsRepository } from './news.repository';
import { TestBed } from '@automock/jest';
import { Testdata } from '../../test/testdata';

describe('NewsRepository', () => {
  let newsRepository: NewsRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(NewsRepository).compile();

    newsRepository = unit;
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
