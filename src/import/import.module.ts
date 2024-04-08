import { Module } from '@nestjs/common';
import { ImportFacade } from './import-facade';
import { FlightModule } from '../flight/flight.module';
import { GliderModule } from '../glider/glider.module';
import { PlaceModule } from '../place/place.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [FlightModule, GliderModule, FlightModule, PlaceModule, UserModule],
  providers: [ImportFacade],
  exports: [ImportFacade]
})
export class ImportModule {}
