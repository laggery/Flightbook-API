import { Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { plainToClass } from 'class-transformer';
import { EmailService } from 'src/email/email.service';
import { SchoolService } from 'src/training/school/school.service';
import { Student } from 'src/training/student/student.entity';
import { StudentRepository } from 'src/training/student/student.repository';
import { UserService } from 'src/user/user.service';
import { EnrollmentDto } from './interface/enrollment-dto';
import { EnrollmentWriteDto } from './interface/enrollment-write-dto';
import { Enrollment } from './enrollment.entity';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentType } from './enrollment-type';
import { TeamMemberService } from 'src/training/team-member/team-member.service';
import { TeamMember } from 'src/training/team-member/team-member.entity';
import { EnrollmentNotFoundException } from './exception/enrollment-not-found-exception';
import { EnrollmentNotAllowedException } from './exception/enrollment-not-allowed-exception';
import { StudentException } from '../student/exception/student.exception';
import { TeamMemberException } from '../team-member/exception/team-member.exception';
import { NoteRepository } from '../note/note.repository';

@Injectable()
export class EnrollmentFacade {
    constructor(
        private enrollmentService: EnrollmentService,
        private userService: UserService,
        private studentRepository: StudentRepository,
        private teamMemberService: TeamMemberService,
        private schoolService: SchoolService,
        private emailService: EmailService,
        private noteRepository: NoteRepository
    ) { }

    async createStudentEnrollment(schoolId: number, enrollmentWriteDto: EnrollmentWriteDto, origin: string): Promise<EnrollmentDto> {
        const user = await this.userService.getUserByEmail(enrollmentWriteDto.email);
        if (user) {
            const students = await this.studentRepository.getStudentsBySchoolId(schoolId);
            const foundStudent = students.find((student: Student) => student.user.id === user.id);
            if (foundStudent) {
                throw StudentException.alreadyExistsException();
            }
        }

        const enrollmentList = await this.enrollmentService.getStudentsEnrollmentByEmailAndSchoolId(enrollmentWriteDto.email, schoolId);
        for (const enrollment of enrollmentList){
            if (new Date() < new Date(enrollment.expireAt)) {
                await this.emailService.sendStudentEnrollement(enrollment, origin);
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
        expireAtDate.setDate(expireAtDate.getDate() + 7);

        enrollment.expireAt = expireAtDate;

        const enrollmentResp = this.enrollmentService.saveEnrollment(enrollment);

        await this.emailService.sendStudentEnrollement(enrollment, origin);

        return plainToClass(EnrollmentDto, enrollmentResp);
    }

    async createTeamMemberEnrollment(schoolId: number, enrollmentWriteDto: EnrollmentWriteDto, origin: string): Promise<EnrollmentDto> {
        const user = await this.userService.getUserByEmail(enrollmentWriteDto.email);
        if (user) {
            const teamMembers = await this.teamMemberService.getTeamMembersBySchoolId(schoolId);
            const foundStudent = teamMembers.find((teamMember: TeamMember) => teamMember.user.id === user.id);
            if (foundStudent) {
                throw TeamMemberException.alreadyExistsException();
            }
        }

        const enrollmentList = await this.enrollmentService.getTeamMemberEnrollmentByEmailAndSchoolId(enrollmentWriteDto.email, schoolId);
        for (const enrollment of enrollmentList){
            if (new Date() < new Date(enrollment.expireAt)) {
                await this.emailService.sendTeamMemberEnrollement(enrollment, origin);
                return plainToClass(EnrollmentDto, enrollment);
            }
        }

        let uuid;
        do {
            uuid = randomStringGenerator();
        } while (await this.enrollmentService.getEnrollmentByToken(uuid));

        const enrollment = new Enrollment();
        enrollment.type = EnrollmentType.TEAM_MEMBER;
        enrollment.email = enrollmentWriteDto.email;
        enrollment.school = await this.schoolService.getSchoolById(schoolId);
        enrollment.token = uuid;

        const expireAtDate = new Date();
        expireAtDate.setDate(expireAtDate.getDate() + 7);

        enrollment.expireAt = expireAtDate;

        const enrollmentResp = this.enrollmentService.saveEnrollment(enrollment);

        await this.emailService.sendTeamMemberEnrollement(enrollment, origin);

        return plainToClass(EnrollmentDto, enrollmentResp);
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
            const students = await this.studentRepository.getStudentsBySchoolId(enrollment.school.id);
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
            const students = await this.studentRepository.getStudentsBySchoolId(enrollment.school.id);
            const foundStudent = students.find((student: Student) => student.user.email === enrollment.email);
            if (foundStudent) {
                throw StudentException.alreadyExistsException();
            }

            const student = new Student();
            student.school = enrollment.school;
            student.user = user;
            const studentEntity = await this.studentRepository.saveStudent(student);

            // Check if user has already been archived
            const archivedStudent = await this.studentRepository.getArchivedStudentsBySchoolId(enrollment.school.id);
            const foundarchivedStudent = archivedStudent.find((student: Student) => student.user.email === enrollment.email);
            if (foundarchivedStudent) {
                const notes = await this.noteRepository.getNotesByArchivedStudentId(foundarchivedStudent.id);
                for (const note of notes) {
                    note.archivedStudent = null;
                    note.student = studentEntity;
                    await this.noteRepository.save(note);
                }
                await this.studentRepository.removeArchivedStudent(foundarchivedStudent);
            }
        } else {
            const teamMembers = await this.teamMemberService.getTeamMembersBySchoolId(enrollment.school.id);
            const foundTeamMember = teamMembers.find((teamMember: TeamMember) => teamMember.user.email === enrollment.email);
            if (foundTeamMember) {
                throw TeamMemberException.alreadyExistsException();
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
