import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContact } from './emergency-contact.entity';
import { User } from '../../user/domain/user.entity';
import { EmergencyContactRepository } from './emergency-contact.repository';
import { EmergencyContactFacade } from './emergency-contact.facade';
import { UserRepository } from '../../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyContact, User])],
  controllers: [],
  providers: [
    EmergencyContactRepository, 
    EmergencyContactFacade,
    UserRepository
  ],
  exports: [EmergencyContactFacade],
})
export class EmergencyContactModule {}
