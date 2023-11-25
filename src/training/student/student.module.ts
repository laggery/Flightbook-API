import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository';
import { StudentFacade } from './student.facade';
import { FlightModule } from 'src/flight/flight.module';
import { TeamMemberModule } from 'src/training/team-member/team-member.module';
import { SchoolModule } from 'src/training/school/school.module';
import { ControlSheetModule } from 'src/training/control-sheet/control-sheet.module';
import { AppointmentModule } from 'src/training/appointment/appointment.module';
import { ArchivedStudent } from './studentArchived.entity';
import { Note } from '../note/note.entity';
import { NoteRepository } from '../note/note.repository';

@Module({
    imports: [
      FlightModule, 
      TypeOrmModule.forFeature([Student, ArchivedStudent, Note]), 
      TeamMemberModule, 
      ControlSheetModule, 
      forwardRef(() => SchoolModule), 
      forwardRef(() => AppointmentModule)
    ],  
    providers: [StudentRepository, StudentFacade, NoteRepository],
    exports: [StudentRepository, StudentFacade],
    controllers: []
  })
export class StudentModule {}
