import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../../email/email.service';
import { SharedModule } from '../../shared/shared.module';
import { SchoolModule } from '../../training/school/school.module';
import { UserModule } from '../../user/user.module';
import { StudentModule } from '../student/student.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AppointmentType } from './appointment-type.entity';
import { AppointmentTypeFacade } from './appointment-type.facade';
import { AppointmentTypeRepository } from './appointment-type.repository';
import { Appointment } from './appointment.entity';
import { AppointmentFacade } from './appointment.facade';
import { AppointmentRepository } from './appointment.repository';
import { FlightRepository } from '../../flight/flight.repository';
import { Flight } from '../../flight/flight.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Appointment, AppointmentType, Flight]),
    forwardRef(() => SchoolModule),
    SubscriptionModule,
    StudentModule,
    SharedModule
  ],
  controllers: [],
  providers: [
    AppointmentFacade,
    AppointmentRepository,
    AppointmentTypeRepository,
    AppointmentTypeFacade,
    EmailService,
    FlightRepository
  ],
  exports: [
    AppointmentFacade,
    AppointmentRepository,
    AppointmentTypeRepository,
    AppointmentTypeFacade
  ]
})
export class AppointmentModule {}
