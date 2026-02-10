import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TandemPilot } from './tandem-pilot.entity';
import { TandemPilotRepository } from './tandem-pilot.repository';
import { TandemPilotFacade } from './tandem-pilot.facade';
import { SchoolModule } from '../school/school.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([TandemPilot]), 
      forwardRef(() => SchoolModule)
    ],  
    providers: [TandemPilotRepository, TandemPilotFacade],
    exports: [TandemPilotRepository, TandemPilotFacade],
    controllers: []
  })
export class TandemPilotModule {}
