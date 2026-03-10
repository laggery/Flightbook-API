import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TandemPilot } from './tandem-pilot.entity';
import { TandemPilotRepository } from './tandem-pilot.repository';
import { TandemPilotFacade } from './tandem-pilot.facade';
import { SchoolModule } from '../school/school.module';
import { PassengerConfirmationModule } from 'src/tandem/passenger-confirmation/passenger-confirmation.module';
import { FlightModule } from 'src/flight/flight.module';

@Module({
    imports: [
      FlightModule,
      TypeOrmModule.forFeature([TandemPilot]), 
      forwardRef(() => SchoolModule),
      PassengerConfirmationModule
    ],  
    providers: [TandemPilotRepository, TandemPilotFacade],
    exports: [TandemPilotRepository, TandemPilotFacade],
    controllers: []
  })
export class TandemPilotModule {}
