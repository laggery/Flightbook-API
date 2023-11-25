import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentFacade } from './enrollment.facade';
import { StudentModule } from 'src/training/student/student.module';
import { UserModule } from 'src/user/user.module';
import { SchoolModule } from 'src/training/school/school.module';
import { EmailService } from 'src/email/email.service';
import { TeamMemberModule } from 'src/training/team-member/team-member.module';
import { HttpModule } from '@nestjs/axios';
import { Note } from '../note/note.entity';
import { NoteRepository } from '../note/note.repository';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Enrollment, Note]),
        forwardRef(() => StudentModule),
        UserModule,
        forwardRef(() => SchoolModule),
        forwardRef(() => TeamMemberModule)
    ],
    providers: [EnrollmentService, EnrollmentFacade, EmailService, NoteRepository],
    exports: [EnrollmentService, EnrollmentFacade],
    controllers: []
})
export class EnrollmentModule { }
