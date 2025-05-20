import { Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { plainToClass } from 'class-transformer';
import { EmailService } from '../../email/email.service';
import { SchoolRepository } from '../school/school.repository';
import { Student } from '../../training/student/student.entity';
import { StudentRepository } from '../../training/student/student.repository';
import { UserRepository } from '../../user/user.repository';
import { EnrollmentDto } from './interface/enrollment-dto';
import { EnrollmentWriteDto } from './interface/enrollment-write-dto';
import { Enrollment } from './enrollment.entity';
import { EnrollmentRepository } from './enrollment.repository';
import { EnrollmentType } from './enrollment-type';
import { TeamMemberRepository } from '../team-member/team-member.repository';
import { TeamMember } from '../../training/team-member/team-member.entity';
import { EnrollmentNotFoundException } from './exception/enrollment-not-found-exception';
import { EnrollmentNotAllowedException } from './exception/enrollment-not-allowed-exception';
import { StudentException } from '../student/exception/student.exception';
import { TeamMemberException } from '../team-member/exception/team-member.exception';
import { ControlSheetRepository } from '../control-sheet/control-sheet.repository';
import { User } from '../../user/user.entity';
import { ControlSheet } from '../control-sheet/control-sheet.entity';
import { School } from '../school/school.entity';

@Injectable()
export class EnrollmentFacade {
    constructor(
        private enrollmentRepository: EnrollmentRepository,
        private userRepository: UserRepository,
        private studentRepository: StudentRepository,
        private teamMemberRepository: TeamMemberRepository,
        private schoolRepository: SchoolRepository,
        private emailService: EmailService,
        private controlSheetRepository: ControlSheetRepository
    ) { }

    async createStudentEnrollment(schoolId: number, enrollmentWriteDto: EnrollmentWriteDto, origin: string): Promise<EnrollmentDto> {
        const user = await this.userRepository.getUserByEmail(enrollmentWriteDto.email);
        if (user) {
            const students = await this.studentRepository.getStudentsBySchoolId(schoolId, false);
            const foundStudent = students.find((student: Student) => student.user.id === user.id);
            if (foundStudent) {
                throw StudentException.alreadyExistsException();
            }
        }

        const enrollmentList = await this.enrollmentRepository.getStudentsEnrollmentByEmailAndSchoolId(enrollmentWriteDto.email, schoolId);
        for (const enrollment of enrollmentList){
            if (new Date() < new Date(enrollment.expireAt)) {
                await this.emailService.sendStudentEnrollement(enrollment, origin);
                return plainToClass(EnrollmentDto, enrollment);
            }
        }

        let uuid;
        do {
            uuid = randomStringGenerator();
        } while (await this.enrollmentRepository.getEnrollmentByToken(uuid));

        const enrollment = new Enrollment();
        enrollment.type = EnrollmentType.STUDENT;
        enrollment.email = enrollmentWriteDto.email;
        enrollment.school = await this.schoolRepository.getSchoolById(schoolId);
        enrollment.token = uuid;

        const expireAtDate = new Date();
        expireAtDate.setDate(expireAtDate.getDate() + 7);

        enrollment.expireAt = expireAtDate;

        const enrollmentResp = this.enrollmentRepository.save(enrollment);

        await this.emailService.sendStudentEnrollement(enrollment, origin);

        return plainToClass(EnrollmentDto, enrollmentResp);
    }

    async createTeamMemberEnrollment(schoolId: number, enrollmentWriteDto: EnrollmentWriteDto, origin: string): Promise<EnrollmentDto> {
        const user = await this.userRepository.getUserByEmail(enrollmentWriteDto.email);
        if (user) {
            const teamMembers = await this.teamMemberRepository.getTeamMembersBySchoolId(schoolId);
            const foundStudent = teamMembers.find((teamMember: TeamMember) => teamMember.user.id === user.id);
            if (foundStudent) {
                throw TeamMemberException.alreadyExistsException();
            }
        }

        const enrollmentList = await this.enrollmentRepository.getTeamMemberEnrollmentByEmailAndSchoolId(enrollmentWriteDto.email, schoolId);
        for (const enrollment of enrollmentList){
            if (new Date() < new Date(enrollment.expireAt)) {
                await this.emailService.sendTeamMemberEnrollement(enrollment, origin);
                return plainToClass(EnrollmentDto, enrollment);
            }
        }

        let uuid;
        do {
            uuid = randomStringGenerator();
        } while (await this.enrollmentRepository.getEnrollmentByToken(uuid));

        const enrollment = new Enrollment();
        enrollment.type = EnrollmentType.TEAM_MEMBER;
        enrollment.email = enrollmentWriteDto.email;
        enrollment.school = await this.schoolRepository.getSchoolById(schoolId);
        enrollment.token = uuid;

        const expireAtDate = new Date();
        expireAtDate.setDate(expireAtDate.getDate() + 7);

        enrollment.expireAt = expireAtDate;

        const enrollmentResp = this.enrollmentRepository.save(enrollment);

        await this.emailService.sendTeamMemberEnrollement(enrollment, origin);

        return plainToClass(EnrollmentDto, enrollmentResp);
    }

    async isFreeEnrollment(token: string): Promise<boolean> {
        const enrollment = await this.enrollmentRepository.getEnrollmentByToken(token);
        if (!enrollment) {
            return false;
        }
        return enrollment.isFree;
    }
    
    async getEnrollmentByToken(token: string): Promise<EnrollmentDto> {
        const enrollment = await this.enrollmentRepository.getEnrollmentByToken(token);
        if (!enrollment) {
            return null;
        }

        if (new Date() > enrollment.expireAt){
            return null;
        }

        // check if user is already student or team member
        if (EnrollmentType.STUDENT == enrollment.type) {
            const students = await this.studentRepository.getStudentsBySchoolId(enrollment.school.id, false);
            const foundStudent = students.find((student: Student) => student.user.email === enrollment.email);
            if (foundStudent) {
                return null;
            }
        } else {
            const teamMembers = await this.teamMemberRepository.getTeamMembersBySchoolId(enrollment.school.id);
            const foundTeamMember = teamMembers.find((teamMember: TeamMember) => teamMember.user.email === enrollment.email);
            if (foundTeamMember) {
                return null;
            }
        }

        const enrollmentDto = plainToClass(EnrollmentDto, enrollment);

        const user = await this.userRepository.getUserByEmail(enrollment.email);
        if (user) {
            enrollmentDto.isUser = true;
        } else {
            enrollmentDto.isUser = false;
        }

        return enrollmentDto;
    }

    async acceptEnrollment(userToken: any, enrollmentToken: string): Promise<boolean> {
        const enrollment = await this.enrollmentRepository.getEnrollmentByToken(enrollmentToken);

        if (!enrollment) {
            throw new EnrollmentNotFoundException();
        }

        const user = await this.userRepository.getUserById(userToken.userId);
        if (user.email != enrollment.email.toLowerCase()){
            throw new EnrollmentNotAllowedException();
        }

        // check if user is already student or team member
        if (EnrollmentType.STUDENT == enrollment.type) {
            const students = await this.studentRepository.getStudentsBySchoolId(enrollment.school.id);
            const foundStudent = students.find((student: Student) => student.user.email === enrollment.email);
            if (foundStudent && !foundStudent.isArchived) {
                throw StudentException.alreadyExistsException();
            } else if (foundStudent) {
                foundStudent.isArchived = false;
                foundStudent.timestamp = new Date(); 
                await this.studentRepository.save(foundStudent);
                await this.addControlSheetToStudent(user, enrollment.school);
            } else {
                const student = new Student();
                student.school = enrollment.school;
                student.user = user;
                const studentEntity = await this.studentRepository.save(student);
                await this.addControlSheetToStudent(user, enrollment.school);
            }
        } else {
            const teamMembers = await this.teamMemberRepository.getTeamMembersBySchoolId(enrollment.school.id);
            const foundTeamMember = teamMembers.find((teamMember: TeamMember) => teamMember.user.email === enrollment.email);
            if (foundTeamMember) {
                throw TeamMemberException.alreadyExistsException();
            }

            const teamMember = new TeamMember();
            teamMember.admin = false;
            teamMember.school= enrollment.school;
            teamMember.user = user;
            this.teamMemberRepository.save(teamMember);
        }

        return true;
    }

    private async addControlSheetToStudent(user: User, school: School) {
        const sheet = await this.controlSheetRepository.getControlSheetByUserId(user.id);
        if (!sheet) {
            const controlSheet = new ControlSheet();
            controlSheet.user = user;
            controlSheet.userCanEdit = school.configuration.userCanEditControlSheet;
            await this.controlSheetRepository.save(controlSheet);
        }
    }
}
