import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';

describe('NewsController (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/news (GET)', async () => {
    // given
    const news = Testdata.createNews('de');
    await testInstance.newsRepository.save(news);

    //when
    return request(testInstance.app.getHttpServer())
      .get('/news/de')
      .expect(200)
      .then(response => {
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
          id: expect.any(Number),
          date: '2024-01-01',
          title: 'title',
          text: 'text',
          language: 'de'
        });
      });
  });
});
