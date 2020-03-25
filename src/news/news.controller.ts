import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { NewsFacade } from './news.facade';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('news')
export class NewsController {

    constructor(private newsFacade: NewsFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get(':language')
    updatePlace(@Param('language') language) {
        return this.newsFacade.getNews(language);
    }
}
