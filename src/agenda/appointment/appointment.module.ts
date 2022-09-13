import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolModule } from 'src/school/school.module';
import { UserModule } from 'src/user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './appointment.entity';
import { AppointmentFacade } from './appointment.facade';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Appointment]),
    forwardRef(() => SchoolModule),
    SubscriptionModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentFacade, AppointmentService],
  exports: [AppointmentFacade, AppointmentService]
})
export class AppointmentModule {}
