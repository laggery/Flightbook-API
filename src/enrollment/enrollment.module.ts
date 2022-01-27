import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentFacade } from './enrollment.facade';
import { StudentModule } from 'src/student/student.module';
import { UserModule } from 'src/user/user.module';
import { SchoolModule } from 'src/school/school.module';
import { EmailService } from 'src/email/email.service';
import { EnrollmentController } from './enrollment.controller';
import { TeamMemberModule } from 'src/team-member/team-member.module';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Enrollment]),
        forwardRef(() => StudentModule),
        UserModule,
        forwardRef(() => SchoolModule),
        forwardRef(() => TeamMemberModule)
    ],
    providers: [EnrollmentService, EnrollmentFacade, EmailService],
    exports: [EnrollmentService, EnrollmentFacade],
    controllers: [EnrollmentController]
})
export class EnrollmentModule { }
