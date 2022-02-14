import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { StudentModule } from 'src/student/student.module';
import { TeamMemberModule } from 'src/team-member/team-member.module';
import { UserModule } from 'src/user/user.module';
import { SchoolController } from './school.controller';
import { School } from './school.entity';
import { SchoolFacade } from './school.facade';
import { SchoolService } from './school.service';

@Module({
  imports: [
    UserModule, 
    forwardRef(() => StudentModule), 
    TypeOrmModule.forFeature([School]), 
    TeamMemberModule,
    EnrollmentModule
  ],
  controllers: [SchoolController],
  providers: [SchoolFacade, SchoolService],
  exports: [SchoolFacade, SchoolService]
})
export class SchoolModule {}
