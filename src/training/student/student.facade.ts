import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AppointmentRepository } from '../../training/appointment/appointment.repository';
import { ControlSheetFacade } from '../../training/control-sheet/control-sheet.facade';
import { ControlSheetDto } from '../../training/control-sheet/interface/control-sheet-dto';
import { FlightFacade } from '../../flight/flight.facade';
import { FlightDto } from '../../flight/interface/flight-dto';
import { SchoolDto } from '../../training/school/interface/school-dto';
import { StudentDto } from './interface/student-dto';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository';
import { StudentException } from './exception/student.exception';
import { UserReadIdDto } from '../../user/interface/user-read-id-dto';
import { PagerEntityDto } from '../../interface/pager-entity-dto';
import { StudentMapper } from './student.mapper';

@Injectable()
export class StudentFacade {

    constructor(
        private studentRepository: StudentRepository,
        private appointmentService: AppointmentRepository,
        private flightFacade: FlightFacade,
        private controlSheetFacade: ControlSheetFacade) { }

    async getStudentsBySchoolId(id: number, archived: boolean): Promise<StudentDto[]> {
        const students = await this.studentRepository.getStudentsBySchoolId(id, archived);
        const studentDtoList: StudentDto[] = [];
        for (const student of students) {
            let query: any = {
                limit: 1
            };
            if (student.isArchived) {
                query.timestamp = student.timestamp;
            }

            let studentDto = StudentMapper.toStudentDto(student, await this.flightFacade.getGlobalStatistic({ userId: student.user.id }, query));
            const flightList = await this.flightFacade.getFlights({ userId: student.user.id }, query)

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            studentDtoList.push(studentDto);
        }
        return studentDtoList;
    }

    // @TODO Improve -> search student entity by user id
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

    async archiveStudent(studentId: number) {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }

        student.isArchived = true;
        student.timestamp = new Date();

        const studentResp = await this.studentRepository.save(student);
        return StudentMapper.toStudentDto(studentResp, await this.flightFacade.getGlobalStatistic({ userId: studentResp.user.id }, {timestamp: studentResp.timestamp}));
    }

    async getActiveSchoolsByUserId(id: number): Promise<SchoolDto[]> {
        const students = await this.studentRepository.getStudentByUserId(id);
        const schoolsDto: SchoolDto[] = [];

        students.forEach((student: Student) => {
            if (!student.isArchived){
                schoolsDto.push(plainToClass(SchoolDto, student.school));
            }
        });

        return schoolsDto;
    }

    async getStudentFlightsByStudentId(studentId: number, query: any): Promise<PagerEntityDto<FlightDto[]>> {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }
        if (student.isArchived) {
            query.timestamp = student.timestamp;
        }
        return await this.flightFacade.getFlightsPager({ userId: student.user.id }, query);
    }

    async updateStudentFlight(studentId: number, flightId: number, flightDto: FlightDto): Promise<FlightDto> {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }

        return await this.flightFacade.updateFlightAlone({ userId: student.user.id }, flightId, flightDto);
    }

    async getStudentControlSheetByStudentId(studentId: number): Promise<ControlSheetDto> {
        const student = await this.studentRepository.getStudentById(studentId);

        if (!student) {
            throw StudentException.notFoundException();
        }
        return await this.controlSheetFacade.getControlSheet({ userId: student.user.id });
    }

    /**
     * This method is used from instructors to create or update a control sheet for a student
     * @param studentId The student id
     * @param controlSheetDto The control sheet dto
     * @returns new or updated control sheet dto
     */
    async postStudentControlSheetByStudentId(studentId: number, controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }
        return await this.controlSheetFacade.instructorCreateUpdateControlSheet({ userId: student.user.id }, controlSheetDto);
    }
}
