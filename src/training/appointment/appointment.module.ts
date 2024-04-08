import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../../email/email.service';
import { NotificationsService } from '../../shared/services/notifications.service';
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

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Appointment, AppointmentType]),
    forwardRef(() => SchoolModule),
    SubscriptionModule,
    StudentModule
  ],
  controllers: [],
  providers: [
    AppointmentFacade,
    AppointmentRepository,
    AppointmentTypeRepository,
    AppointmentTypeFacade,
    EmailService,
    NotificationsService
  ],
  exports: [
    AppointmentFacade,
    AppointmentRepository,
    AppointmentTypeRepository,
    AppointmentTypeFacade
  ]
})
export class AppointmentModule {}
