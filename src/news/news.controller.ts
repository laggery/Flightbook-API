import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsFacade } from './news.facade';

@Controller('news')
@ApiTags('News')
export class NewsController {

    constructor(private newsFacade: NewsFacade) { }

    @Get(':language')
    updatePlace(@Param('language') language) {
        return this.newsFacade.getNews(language);
    }
}
