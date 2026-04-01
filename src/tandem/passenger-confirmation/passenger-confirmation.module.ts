import { Module } from '@nestjs/common';
import { PassengerConfirmationFacade } from './passenger-confirmation.facade';
import { PassengerConfirmation } from './passenger-confirmation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerConfirmationRepository } from './passenger-confirmation.repository';
import { PassengerConfirmationController } from './passenger-confirmation.controller';
import { UserModule } from '../../user/user.module';
import { SchoolRepository } from '../../training/school/school.repository';
import { School } from '../../training/school/domain/school.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PassengerConfirmation, School]),
    UserModule
  ],
  controllers: [
    PassengerConfirmationController
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
