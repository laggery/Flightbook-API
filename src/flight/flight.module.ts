import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightRepository } from './flight.repository';
import { Flight } from './flight.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightFacade } from './flight.facade';
import { UserModule } from 'src/user/user.module';
import { PlaceModule } from 'src/place/place.module';
import { GliderModule } from 'src/glider/glider.module';
import { FileUploadService } from 'src/fileupload/file-upload.service';
import { FlightControllerV2 } from './flight.controllerV2';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Flight]), PlaceModule, GliderModule],
  controllers: [FlightController, FlightControllerV2],
  providers: [FlightRepository, FlightFacade, FileUploadService],
  exports: [FlightFacade, FlightRepository]
})
export class FlightModule {}
