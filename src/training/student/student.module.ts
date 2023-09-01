import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { StudentFacade } from './student.facade';
import { FlightModule } from 'src/flight/flight.module';
import { TeamMemberModule } from 'src/training/team-member/team-member.module';
import { SchoolModule } from 'src/training/school/school.module';
import { ControlSheetModule } from 'src/training/control-sheet/control-sheet.module';
import { AppointmentModule } from 'src/training/appointment/appointment.module';
import { ArchivedStudent } from './studentArchived.entity';

@Module({
    imports: [FlightModule, TypeOrmModule.forFeature([Student, ArchivedStudent]), TeamMemberModule, ControlSheetModule, forwardRef(() => SchoolModule), forwardRef(() => AppointmentModule)],  
    providers: [StudentService, StudentFacade],
    exports: [StudentService, StudentFacade],
    controllers: []
  })
export class StudentModule {}
