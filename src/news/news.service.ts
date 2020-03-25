import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {

    constructor(
        @InjectRepository(News)
        private readonly placeRepository: Repository<News>
    ) { }

    async getNews(language: string): Promise<any> {
        let options: any = {
            where: {
                language: language
            },
            order: {
                date: 'DESC'
            }
        };
        return await this.placeRepository.find(options);
    }
}
