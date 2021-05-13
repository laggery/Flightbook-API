import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightFacade } from './flight.facade';
import { UserModule } from 'src/user/user.module';
import { PlaceModule } from 'src/place/place.module';
import { GliderModule } from 'src/glider/glider.module';
import { S3Service } from '../util/s3.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Flight]), PlaceModule, GliderModule],
  controllers: [FlightController],
  providers: [FlightService, FlightFacade, S3Service]
})
export class FlightModule {}
