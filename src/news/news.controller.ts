import { Controller, Get, Param } from '@nestjs/common';
import { NewsFacade } from './news.facade';

@Controller('news')
export class NewsController {

    constructor(private newsFacade: NewsFacade) { }

    @Get(':language')
    updatePlace(@Param('language') language) {
        return this.newsFacade.getNews(language);
    }
}
