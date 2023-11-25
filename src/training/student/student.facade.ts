import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AppointmentRepository } from 'src/training/appointment/appointment.repository';
import { ControlSheetFacade } from 'src/training/control-sheet/control-sheet.facade';
import { ControlSheetDto } from 'src/training/control-sheet/interface/control-sheet-dto';
import { FlightFacade } from 'src/flight/flight.facade';
import { FlightDto } from 'src/flight/interface/flight-dto';
import { SchoolDto } from 'src/training/school/interface/school-dto';
import { StudentDto } from './interface/student-dto';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository';
import { StudentException } from './exception/student.exception';
import { UserReadIdDto } from 'src/user/interface/user-read-id-dto';
import { ArchivedStudent } from './studentArchived.entity';
import { PagerEntityDto } from 'src/interface/pager-entity-dto';
import { NoteRepository } from '../note/note.repository';

@Injectable()
export class StudentFacade {

    constructor(
        private studentRepository: StudentRepository,
        private appointmentService: AppointmentRepository,
        private flightFacade: FlightFacade,
        private controlSheetFacade: ControlSheetFacade,
        private noteRepository: NoteRepository) { }

    async getStudentsBySchoolId(id: number): Promise<StudentDto[]> {
        const students = await this.studentRepository.getStudentsBySchoolId(id);
        const studentDtoList: StudentDto[] = [];
        for (const student of students) {
            let studentDto = new StudentDto();
            studentDto.id = student.id;
            studentDto.user = plainToClass(UserReadIdDto, student.user);
            studentDto.statistic = await this.flightFacade.getGlobalStatistic({ userId: student.user.id }, {});
            const flightList = await this.flightFacade.getFlights({ userId: student.user.id }, { limit: 1 })

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            studentDtoList.push(studentDto);
        }
        return studentDtoList;
    }

    async getArchivedStudentsBySchoolId(id: number): Promise<StudentDto[]> {
        const students = await this.studentRepository.getArchivedStudentsBySchoolId(id);
        const studentDtoList: StudentDto[] = [];
        for (const student of students) {
            let studentDto = new StudentDto();
            studentDto.id = student.id;
            studentDto.user = plainToClass(UserReadIdDto, student.user);
            studentDto.statistic = await this.flightFacade.getGlobalStatistic({ userId: student.user.id }, { timestamp: student.timestamp });
            const flightList = await this.flightFacade.getFlights({ userId: student.user.id }, { timestamp: student.timestamp, limit: 1 })

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            studentDtoList.push(studentDto);
        }
        return studentDtoList;
    }

    async getStudentsByAppointmentId(appointmentId: number): Promise<StudentDto[]> {
        const appointment = await this.appointmentService.getAppointmentById(appointmentId);
        const studentDtoList: StudentDto[] = [];
        for (const subscription of appointment.subscriptions) {
            let studentDto = new StudentDto();
            studentDto.user = plainToClass(UserReadIdDto, subscription.user);
            studentDto.statistic = await this.flightFacade.getGlobalStatistic({ userId: subscription.user.id }, {});
            const flightList = await this.flightFacade.getFlights({ userId: subscription.user.id }, { limit: 1 })

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            studentDtoList.push(studentDto);
        }
        return studentDtoList;
    }

    async removeStudent(studentId: number) {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }

        let archivedStudentEntity = await this.studentRepository.getArchivedStudentByUserIdAndSchoolId(student.user.id, student.school.id);
        if (archivedStudentEntity) {
            archivedStudentEntity.timestamp = new Date();
        } else {
            archivedStudentEntity = new ArchivedStudent();
            archivedStudentEntity.school = student.school;
            archivedStudentEntity.user = student.user;
        }

        archivedStudentEntity = await this.studentRepository.saveArchivedStudent(archivedStudentEntity);

        const notes = await this.noteRepository.getNotesByStudentId(student.id);
        for (const note of notes) {
            note.archivedStudent = archivedStudentEntity;
            note.student = null;
            await this.noteRepository.save(note);
        }

        await this.studentRepository.removeStudent(student);
        const studentDto = new StudentDto();
        studentDto.user = plainToClass(UserReadIdDto, student.user);
        return studentDto;
    }

    async getSchoolsByUserId(id: number): Promise<SchoolDto[]> {
        const students = await this.studentRepository.getStudentByUserId(id);
        const schoolsDto: SchoolDto[] = [];

        students.forEach((student: Student) => {
            schoolsDto.push(plainToClass(SchoolDto, student.school));
        });

        return schoolsDto;
    }

    async getStudentFlightsByStudentId(studentId: number, query: any): Promise<PagerEntityDto<FlightDto[]>> {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }
        return await this.flightFacade.getFlightsPager({ userId: student.user.id }, query);
    }

    async getArchivedStudentFlightsByStudentId(studentId: number, query: any): Promise<PagerEntityDto<FlightDto[]>> {
        const archivedStudent = await this.studentRepository.getArchivedStudentById(studentId);
        if (archivedStudent) {
            query.timestamp = archivedStudent.timestamp
            return await this.flightFacade.getFlightsPager({ userId: archivedStudent.user.id }, query);
        }
    }

    async getStudentControlSheetByStudentId(studentId: number, isArchived: boolean): Promise<ControlSheetDto> {
        let student;
        if (isArchived) {
            student = await this.studentRepository.getArchivedStudentById(studentId);
        } else {
            student = await this.studentRepository.getStudentById(studentId);
        }
        if (!student) {
            throw StudentException.notFoundException();
        }
        return await this.controlSheetFacade.getControlSheet({ userId: student.user.id });
    }

    async postStudentControlSheetByStudentId(studentId: number, controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }
        return await this.controlSheetFacade.createUpdateControlSheet({ userId: student.user.id }, controlSheetDto);
    }
}
