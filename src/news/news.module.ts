import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsFacade } from './news.facade';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsService, NewsFacade]
})
export class NewsModule {}
