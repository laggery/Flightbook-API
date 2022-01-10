import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { StudentFacade } from './student.facade';
import { FlightModule } from 'src/flight/flight.module';
import { StudentController } from './student.controller';
import { TeamMemberModule } from 'src/team-member/team-member.module';
import { SchoolModule } from 'src/school/school.module';

@Module({
    imports: [FlightModule, TypeOrmModule.forFeature([Student]), TeamMemberModule, forwardRef(() => SchoolModule)],  
    providers: [StudentService, StudentFacade],
    exports: [StudentService, StudentFacade],
    controllers: [StudentController]
  })
export class StudentModule {}
