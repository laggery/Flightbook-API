import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from './appointment/appointment.module';
import { ControlSheetModule } from './control-sheet/control-sheet.module';
import { EnrollmentController } from './controller/enrollment.controller';
import { InstructorController } from './controller/instructor.controller';
import { StudentController } from './controller/student.controller';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { SchoolController } from './school/school.controller';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TeamMemberModule } from './team-member/team-member.module';
import { NoteModule } from './note/note.module';
import { EmergencyContactModule } from './emergency-contact/emergency-contact.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([]),
      AppointmentModule,
      SubscriptionModule,
      ControlSheetModule,
      StudentModule,
      TeamMemberModule,
      SchoolModule,
      EnrollmentModule,
      NoteModule,
      EmergencyContactModule
    ],
    controllers: [
        InstructorController,
        StudentController,
        EnrollmentController,
        SchoolController
    ],
    providers: [],
    exports: []
  })
export class TrainingModule {}
