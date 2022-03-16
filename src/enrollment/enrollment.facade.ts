import { HttpException, Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { plainToClass } from 'class-transformer';
import { EmailBodyDto } from 'src/email/email-body-dto';
import { EmailService } from 'src/email/email.service';
import { SchoolService } from 'src/school/school.service';
import { Student } from 'src/student/student.entity';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';
import { StudentAlreadyExistsException } from '../student/exception/student-already-exists-exception';
import { EnrollmentDto } from './interface/enrollment-dto';
import { EnrollmentWriteDto } from './interface/enrollment-write-dto';
import { Enrollment } from './enrollment.entity';
import { EnrollmentService } from './enrollment.service';
import * as moment from 'moment';
import { EnrollmentType } from './enrollment-type';
import { TeamMemberService } from 'src/team-member/team-member.service';
import { TeamMember } from 'src/team-member/team-member.entity';
import { EnrollmentNotFoundException } from './exception/enrollment-not-found-exception';
import { TeamMemberAlreadyExistsException } from '../team-member/exception/team-member-already-exists-exception';
import { EnrollmentNotAllowedException } from './exception/enrollment-not-allowed-exception';

@Injectable()
export class EnrollmentFacade {
    constructor(
        private enrollmentService: EnrollmentService,
        private userService: UserService,
        private studenService: StudentService,
        private teamMemberService: TeamMemberService,
        private schoolService: SchoolService,
        private emailService: EmailService
    ) { }

    async createStudentEnrollment(schoolId: number, enrollmentWriteDto: EnrollmentWriteDto, origin: string): Promise<EnrollmentDto> {
        const user = await this.userService.getUserByEmail(enrollmentWriteDto.email);
        if (user) {
            const students = await this.studenService.getStudentsBySchoolId(schoolId);
            const foundStudent = students.find((student: Student) => student.user.id === user.id);
            if (foundStudent) {
                throw new StudentAlreadyExistsException();
            }
        }

        const enrollmentList = await this.enrollmentService.getStudentsEnrollmentByEmailAndSchoolId(enrollmentWriteDto.email, schoolId);
        for (const enrollment of enrollmentList){
            if (new Date() < new Date(enrollment.expireAt)) {
                await this.sendMail(enrollment, origin);
                return plainToClass(EnrollmentDto, enrollment);
            }
        }

        let uuid;
        do {
            uuid = randomStringGenerator();
        } while (await this.enrollmentService.getEnrollmentByToken(uuid));

        const enrollment = new Enrollment();
        enrollment.type = EnrollmentType.STUDENT;
        enrollment.email = enrollmentWriteDto.email;
        enrollment.school = await this.schoolService.getSchoolById(schoolId);
        enrollment.token = uuid;

        const expireAtDate = new Date();
        expireAtDate.setDate(expireAtDate.getDate() + 2);

        enrollment.expireAt = expireAtDate;

        const enrollmentResp = this.enrollmentService.saveEnrollment(enrollment);

        await this.sendMail(enrollment, origin);

        return plainToClass(EnrollmentDto, enrollmentResp);
    }

    async sendMail(enrollment: Enrollment, origin: string) {
        const emailBody = new EmailBodyDto();
        emailBody.toAddress = enrollment.email;
        emailBody.subject = "Share flightbook";
        emailBody.content = `<p>Hello</p>
        <p>${ enrollment.school.name } invite you to share your flightbook. You can accept this invitation by follow the link below.</p>
        <p>Link : ${origin}/enrollments/${enrollment.token}</p>
        <p>The link expire ${moment(enrollment.expireAt).format('DD.MM.YYYY HH:mm')}`;

        try {
            await this.emailService.sendEmail(emailBody);
        } catch (e) {
            throw new HttpException("Email service is unavailable", 503);
        }
    }
    
    async getEnrollmentByToken(token: string): Promise<EnrollmentDto> {
        const enrollment = await this.enrollmentService.getEnrollmentByToken(token);
        if (!enrollment) {
            return null;
        }

        if (new Date() > enrollment.expireAt){
            return null;
        }

        // check if user is already student or team member
        if (EnrollmentType.STUDENT == enrollment.type) {
            const students = await this.studenService.getStudentsBySchoolId(enrollment.school.id);
            const foundStudent = students.find((student: Student) => student.user.email === enrollment.email);
            if (foundStudent) {
                return null;
            }
        } else {
            const teamMembers = await this.teamMemberService.getTeamMembersBySchoolId(enrollment.school.id);
            const foundTeamMember = teamMembers.find((teamMember: TeamMember) => teamMember.user.email === enrollment.email);
            if (foundTeamMember) {
                return null;
            }
        }

        const enrollmentDto = plainToClass(EnrollmentDto, enrollment);

        const user = await this.userService.getUserByEmail(enrollment.email);
        if (user) {
            enrollmentDto.isUser = true;
        } else {
            enrollmentDto.isUser = false;
        }

        return enrollmentDto;
    }

    async acceptEnrollment(userToken: any, enrollmentToken: string): Promise<boolean> {
        const enrollment = await this.enrollmentService.getEnrollmentByToken(enrollmentToken);

        if (!enrollment) {
            throw new EnrollmentNotFoundException();
        }

        const user = await this.userService.getUserById(userToken.userId);
        if (user.email != enrollment.email){
            throw new EnrollmentNotAllowedException();
        }

        // check if user is already student or team member
        if (EnrollmentType.STUDENT == enrollment.type) {
            const students = await this.studenService.getStudentsBySchoolId(enrollment.school.id);
            const foundStudent = students.find((student: Student) => student.user.email === enrollment.email);
            if (foundStudent) {
                throw new StudentAlreadyExistsException();
            }

            const student = new Student();
            student.school = enrollment.school;
            student.user = user;
            await this.studenService.saveStudent(student);
        } else {
            const teamMembers = await this.teamMemberService.getTeamMembersBySchoolId(enrollment.school.id);
            const foundTeamMember = teamMembers.find((teamMember: TeamMember) => teamMember.user.email === enrollment.email);
            if (foundTeamMember) {
                throw new TeamMemberAlreadyExistsException();
            }

            const teamMember = new TeamMember();
            teamMember.admin = false;
            teamMember.school= enrollment.school;
            teamMember.user = user;
            this.teamMemberService.saveTeamMember(teamMember);
        }

        return true;
    }
}
