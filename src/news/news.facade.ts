import { Injectable } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './news.entity';

@Injectable()
export class NewsFacade {

    constructor(private newsService: NewsService) { }

    async getNews(language: string): Promise<News[]> {
        return this.newsService.getNews(language);
    }
}
