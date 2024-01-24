import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceRepository } from './place.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { PlaceFacade } from './place.facade';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Place]), HttpModule],
  controllers: [PlaceController],
  providers: [PlaceRepository, PlaceFacade],
  exports: [PlaceFacade, PlaceRepository]
})
export class PlaceModule {}
