import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { NotificationsService } from 'src/shared/services/notifications.service';
import { SchoolModule } from 'src/training/school/school.module';
import { UserModule } from 'src/user/user.module';
import { StudentModule } from '../student/student.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { Appointment } from './appointment.entity';
import { AppointmentFacade } from './appointment.facade';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Appointment]),
    forwardRef(() => SchoolModule),
    SubscriptionModule,
    StudentModule
  ],
  controllers: [],
  providers: [AppointmentFacade, AppointmentService, EmailService, NotificationsService],
  exports: [AppointmentFacade, AppointmentService]
})
export class AppointmentModule {}
