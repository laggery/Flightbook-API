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
import { StudentService } from './student.service';
import { StudentException } from './exception/student.exception';
import { UserReadIdDto } from 'src/user/interface/user-read-id-dto';
import { ArchivedStudent } from './studentArchived.entity';
import { PagerEntityDto } from 'src/interface/pager-entity-dto';

@Injectable()
export class StudentFacade {

    constructor(
        private studentService: StudentService,
        private appointmentService: AppointmentRepository,
        private flightFacade: FlightFacade,
        private controlSheetFacade: ControlSheetFacade) { }

    async getStudentsBySchoolId(id: number): Promise<StudentDto[]> {
        const students = await this.studentService.getStudentsBySchoolId(id);
        const studentDtoList: StudentDto[] = [];
        for (const student of students){
            let studentDto = new StudentDto();
            studentDto.user = plainToClass(UserReadIdDto, student.user);
            studentDto.statistic = await this.flightFacade.getGlobalStatistic({userId: student.user.id}, {});
            const flightList = await this.flightFacade.getFlights({userId: student.user.id}, {limit: 1})

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            studentDtoList.push(studentDto);
        }
        return studentDtoList;
    }

    async getArchivedStudentsBySchoolId(id: number): Promise<StudentDto[]> {
        const students = await this.studentService.getArchivedStudentsBySchoolId(id);
        const studentDtoList: StudentDto[] = [];
        for (const student of students){
            let studentDto = new StudentDto();
            studentDto.user = plainToClass(UserReadIdDto, student.user);
            studentDto.statistic = await this.flightFacade.getGlobalStatistic({userId: student.user.id}, {timestamp: student.timestamp});
            const flightList = await this.flightFacade.getFlights({userId: student.user.id}, {timestamp: student.timestamp,limit: 1})

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
        for (const subscription of appointment.subscriptions){
            let studentDto = new StudentDto();
            studentDto.user = plainToClass(UserReadIdDto, subscription.user);
            studentDto.statistic = await this.flightFacade.getGlobalStatistic({userId: subscription.user.id}, {});
            const flightList = await this.flightFacade.getFlights({userId: subscription.user.id}, {limit: 1})

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            studentDtoList.push(studentDto);
        }
        return studentDtoList;
    }

    async removeStudent(id: number, schoolId: number) {
        const student = await this.studentService.getStudentsByIdAndSchoolId(id, schoolId)
        if (!student) {
            throw StudentException.notFoundException();
        }

        const updateResult = await this.studentService.updateArchivedStudentByIdAndSchoolId(student.user.id, student.school.id);
        if (updateResult?.affected == 0) {
            const archivedStudent = new ArchivedStudent();
            archivedStudent.school = student.school;
            archivedStudent.user = student.user;
            await this.studentService.saveArchivedStudent(archivedStudent);
        }
        
        await this.studentService.removeStudent(student);
        const studentDto = new StudentDto();
        studentDto.user = plainToClass(UserReadIdDto, student.user);
        return studentDto;
    }

    async getSchoolsByUserId(id: number): Promise<SchoolDto[]>  {
        const students = await this.studentService.getStudentById(id);
        const schoolsDto: SchoolDto[] = [];
        
        students.forEach((student: Student) => {
            schoolsDto.push(plainToClass(SchoolDto, student.school));
        });

        return schoolsDto;
    }

    async getStudentFlightsByStudentId(studentId: number, query: any): Promise<PagerEntityDto<FlightDto[]>> {
        return await this.flightFacade.getFlightsPager({userId: studentId}, query);
    }

    async getArchivedStudentFlightsByIdAndSchoolId(studentId: number, schoolId: number, query: any): Promise<PagerEntityDto<FlightDto[]>> {
        const archivedStudent = await this.studentService.getArchivedStudentsByIdAndSchoolId(studentId, schoolId);
        if (archivedStudent) {
            query.timestamp = archivedStudent.timestamp
            return await this.flightFacade.getFlightsPager({userId: studentId}, query);
        }
    }

    async getStudentControlSheetByStudentId(studentId: number): Promise<ControlSheetDto> {
        return await this.controlSheetFacade.getControlSheet({userId: studentId});
    }

    async postStudentControlSheetByStudentId(studentId: number, controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return await this.controlSheetFacade.createUpdateControlSheet({userId: studentId}, controlSheetDto);
    }
}
