import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { PlaceFacade } from './place.facade';

@Module({
  imports: [TypeOrmModule.forFeature([Place, User])],
  controllers: [PlaceController],
  providers: [PlaceService, UserService, PlaceFacade]
})
export class PlaceModule {}
