import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ControlSheetFacade } from 'src/control-sheet/control-sheet.facade';
import { ControlSheetDto } from 'src/control-sheet/interface/control-sheet-dto';
import { FlightFacade } from 'src/flight/flight.facade';
import { FlightDto } from 'src/flight/interface/flight-dto';
import { StudentDto } from './interface/student-dto';
import { StudentUserReadDto } from './interface/student-user-read-dto';
import { StudentService } from './student.service';

@Injectable()
export class StudentFacade {

    constructor(
        private studentService: StudentService,
        private flightFacade: FlightFacade,
        private controlSheetFacade: ControlSheetFacade) { }

    async getStudentsBySchoolId(id: number): Promise<StudentDto[]> {
        const students = await this.studentService.getStudentsBySchoolId(id);
        const studentDtoList: StudentDto[] = [];
        for (const student of students){
            let studentDto = new StudentDto();
            studentDto.user = plainToClass(StudentUserReadDto, student.user);
            studentDto.statistic = await this.flightFacade.getStatistic({userId: student.user.id}, {});
            const flightList = await this.flightFacade.getFlights({userId: student.user.id}, {limit: 1})

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            studentDtoList.push(studentDto);
        }
        return studentDtoList;
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
