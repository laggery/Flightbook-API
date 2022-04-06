import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { NewsFacade } from './news.facade';

@Controller('news')
@ApiTags('News')
export class NewsController {

    constructor(private newsFacade: NewsFacade) { }

    @Get(':language')
    @ApiParam({name: 'language', example: "fr", required: true, schema: { oneOf: [{type: 'string'}]}})
    updatePlace(@Param('language') language) {
        return this.newsFacade.getNews(language);
    }
}
