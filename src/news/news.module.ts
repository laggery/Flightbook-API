import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { NewsFacade } from './news.facade';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsRepository, NewsFacade]
})
export class NewsModule {}
