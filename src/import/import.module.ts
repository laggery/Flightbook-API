import { Module } from '@nestjs/common';
import { ImportFacade } from './import-facade';
import { FlightModule } from 'src/flight/flight.module';
import { GliderModule } from 'src/glider/glider.module';
import { PlaceModule } from 'src/place/place.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [FlightModule, GliderModule, FlightModule, PlaceModule, UserModule],
  providers: [ImportFacade],
  exports: [ImportFacade]
})
export class ImportModule {}
