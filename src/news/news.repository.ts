import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsRepository extends Repository<News> {

    constructor(
        @InjectRepository(News)
        repository: Repository<News>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getNews(language: string): Promise<News[]> {
        const options: any = {
            where: {
                language: language
            },
            order: {
                date: 'DESC'
            }
        };
        return await this.find(options);
    }
}
