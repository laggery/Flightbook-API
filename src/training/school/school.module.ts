import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from 'src/training/appointment/appointment.module';
import { StudentModule } from 'src/training/student/student.module';
import { TeamMemberModule } from 'src/training/team-member/team-member.module';
import { UserModule } from 'src/user/user.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { School } from './school.entity';
import { SchoolFacade } from './school.facade';
import { SchoolService } from './school.service';

@Module({
  imports: [
    UserModule, 
    forwardRef(() => StudentModule), 
    TypeOrmModule.forFeature([School]), 
    TeamMemberModule,
    forwardRef(() => EnrollmentModule)
  ],
  controllers: [],
  providers: [SchoolFacade, SchoolService],
  exports: [SchoolFacade, SchoolService]
})
export class SchoolModule {}
