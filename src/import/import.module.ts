import { Module } from '@nestjs/common';
import { ImportFacade } from './import.facade';
import { FlightModule } from '../flight/flight.module';
import { GliderModule } from '../glider/glider.module';
import { PlaceModule } from '../place/place.module';
import { UserModule } from '../user/user.module';
import { ImportController } from './import.controller';
import { FileUploadService } from '../fileupload/file-upload.service';
import { EmailService } from '../email/email.service';
import { FlugbuchFacade } from './flugbuch.facade';

@Module({
  imports: [FlightModule, GliderModule, FlightModule, PlaceModule, UserModule],
  providers: [ImportFacade, FlugbuchFacade, FileUploadService, EmailService],
  exports: [ImportFacade, FlugbuchFacade],
  controllers: [ImportController]
})
export class ImportModule {}
