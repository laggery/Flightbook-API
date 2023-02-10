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
            studentDto.statistic = await this.flightFacade.getStatistic({userId: student.user.id}, {});
            const flightList = await this.flightFacade.getFlights({userId: student.user.id}, {limit: 1})

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
            studentDto.statistic = await this.flightFacade.getStatistic({userId: subscription.user.id}, {});
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
        this.studentService.removeStudent(student)
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

    async getStudentFlightsByStudentId(studentId: number,): Promise<FlightDto[]> {
        return await this.flightFacade.getFlights({userId: studentId}, {});
    }

    async getStudentControlSheetByStudentId(studentId: number): Promise<ControlSheetDto> {
        return await this.controlSheetFacade.getControlSheet({userId: studentId});
    }

    async postStudentControlSheetByStudentId(studentId: number, controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return await this.controlSheetFacade.createUpdateControlSheet({userId: studentId}, controlSheetDto);
    }
}
