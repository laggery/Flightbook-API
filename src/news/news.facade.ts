import { Injectable } from '@nestjs/common';
import { NewsRepository } from './news.repository';
import { News } from './news.entity';

@Injectable()
export class NewsFacade {

    constructor(private newsRepository: NewsRepository) { }

    async getNews(language: string): Promise<News[]> {
        return this.newsRepository.getNews(language);
    }
}
