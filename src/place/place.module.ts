import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { PlaceFacade } from './place.facade';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Place]), HttpModule],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceFacade],
  exports: [PlaceFacade]
})
export class PlaceModule {}
