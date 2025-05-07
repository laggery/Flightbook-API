import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository';
import { StudentFacade } from './student.facade';
import { FlightModule } from '../../flight/flight.module';
import { TeamMemberModule } from '../../training/team-member/team-member.module';
import { SchoolModule } from '../../training/school/school.module';
import { ControlSheetModule } from '../../training/control-sheet/control-sheet.module';
import { AppointmentModule } from '../../training/appointment/appointment.module';
import { Note } from '../note/note.entity';
import { NoteRepository } from '../note/note.repository';
import { EmergencyContactModule } from '../emergency-contact/emergency-contact.module';
import { SchoolRepository } from '../school/school.repository';
import { School } from '../school/school.entity';

@Module({
    imports: [
      FlightModule, 
      TypeOrmModule.forFeature([Student, Note, School]), 
      TeamMemberModule, 
      ControlSheetModule,
      EmergencyContactModule, 
      forwardRef(() => SchoolModule), 
      forwardRef(() => AppointmentModule)
    ],  
    providers: [StudentRepository, SchoolRepository, StudentFacade, NoteRepository],
    exports: [StudentRepository, StudentFacade],
    controllers: []
  })
export class StudentModule {}
