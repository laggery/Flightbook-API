import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from './appointment/appointment.module';
import { ControlSheetModule } from './control-sheet/control-sheet.module';
import { EnrollmentController } from './controller/enrollment.controller';
import { InstructorController } from './controller/instructor.controller';
import { StudentController } from './controller/student.controller';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TeamMemberModule } from './team-member/team-member.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([]),
      AppointmentModule,
      SubscriptionModule,
      ControlSheetModule,
      StudentModule,
      TeamMemberModule,
      SchoolModule,
      EnrollmentModule
    ],
    controllers: [
        InstructorController,
        StudentController,
        EnrollmentController
    ],
    providers: [],
    exports: []
  })
export class TrainingModule {}