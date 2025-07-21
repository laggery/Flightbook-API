import { Module } from '@nestjs/common';
import { PassengerConfirmationFacade } from './passenger-confirmation.facade';
import { PassengerConfirmation } from './passenger-confirmation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerConfirmationRepository } from './passenger-confirmation.repository';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PassengerConfirmation]),
    UserModule
  ],
  providers: [
    PassengerConfirmationFacade,
    PassengerConfirmationRepository
  ],
  exports: [
    PassengerConfirmationFacade,
    PassengerConfirmationRepository
  ]
})
export class PassengerConfirmationModule { }
