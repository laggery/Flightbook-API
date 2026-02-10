import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentRepository } from './enrollment.repository';
import { EnrollmentFacade } from './enrollment.facade';
import { StudentModule } from '../../training/student/student.module';
import { UserModule } from '../../user/user.module';
import { SchoolModule } from '../../training/school/school.module';
import { EmailService } from '../../email/email.service';
import { TeamMemberModule } from '../../training/team-member/team-member.module';
import { HttpModule } from '@nestjs/axios';
import { Note } from '../note/note.entity';
import { NoteRepository } from '../note/note.repository';
import { ControlSheetRepository } from '../control-sheet/control-sheet.repository';
import { ControlSheet } from '../control-sheet/control-sheet.entity';
import { TandemPilotModule } from '../tandem-pilot/tandem-pilot.module';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Enrollment, Note, ControlSheet]),
        forwardRef(() => StudentModule),
        UserModule,
        forwardRef(() => SchoolModule),
        forwardRef(() => TeamMemberModule),
        forwardRef(() => TandemPilotModule)
    ],
    providers: [EnrollmentRepository, EnrollmentFacade, EmailService, NoteRepository, ControlSheetRepository],
    exports: [EnrollmentRepository, EnrollmentFacade],
    controllers: []
})
export class EnrollmentModule { }
