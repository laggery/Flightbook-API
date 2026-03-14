import { Module } from '@nestjs/common';
import { PassengerConfirmationFacade } from './passenger-confirmation.facade';
import { PassengerConfirmation } from './passenger-confirmation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerConfirmationRepository } from './passenger-confirmation.repository';
import { UserModule } from '../../user/user.module';
import { SchoolRepository } from '../../training/school/school.repository';
import { School } from '../../training/school/school.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PassengerConfirmation, School]),
    UserModule
  ],
  providers: [
    PassengerConfirmationFacade,
    PassengerConfirmationRepository,
    SchoolRepository
  ],
  exports: [
    PassengerConfirmationFacade,
    PassengerConfirmationRepository
  ]
})
export class PassengerConfirmationModule { }
