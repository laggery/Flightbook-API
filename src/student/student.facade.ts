import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FlightFacade } from 'src/flight/flight.facade';
import { FlightDto } from 'src/flight/interface/flight-dto';
import { UserReadDto } from 'src/user/interface/user-read-dto';
import { StudentDto } from './interface/student-dto';
import { StudentUserReadDto } from './interface/student-user-read-dto';
import { StudentService } from './student.service';

@Injectable()
export class StudentFacade {

    constructor(
        private studentService: StudentService,
        private flightFacade: FlightFacade) { }

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
}
