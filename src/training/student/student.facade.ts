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
import { PagerEntityDto } from '../../interface/pager-entity-dto';
import { StudentMapper } from './student.mapper';
import { NoteRepository } from '../note/note.repository';
import { NoteMapper } from '../note/note.mapper';
import { EmergencyContactFacade } from '../emergency-contact/emergency-contact.facade';
import { EmergencyContactDto } from '../emergency-contact/interface/emergency-contact-dto';
import { SchoolException } from '../school/exception/school.exception';
import { SchoolRepository } from '../school/school.repository';

@Injectable()
export class StudentFacade {

    constructor(
        private studentRepository: StudentRepository,
        private schoolRepository: SchoolRepository,
        private appointmentRepository: AppointmentRepository,
        private noteRepository: NoteRepository,
        private flightFacade: FlightFacade,
        private controlSheetFacade: ControlSheetFacade,
        private emergencyContactFacade: EmergencyContactFacade) { }

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
            if (student.isTandem) {
                query["glider-type"] = 1;
            }

            let studentDto = StudentMapper.toStudentDto(student, await this.flightFacade.getGlobalStatistic({ userId: student.user.id }, query));
            const flightList = await this.flightFacade.getFlights({ userId: student.user.id }, query)

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            studentDto.countNotValidatedFlights = await this.flightFacade.countNotValidatedFlights({ userId: student.user.id }, student.isTandem);

            studentDtoList.push(studentDto);
        }
        return studentDtoList;
    }

    async getStudentsByAppointmentId(appointmentId: number): Promise<StudentDto[]> {
        const appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
        const studentDtoList: StudentDto[] = [];
        for (const subscription of appointment.subscriptions) {
            const student = await this.studentRepository.getStudentByUserIdAndSchoolId(subscription.user.id, appointment.school.id);
            const statistics = await this.flightFacade.getGlobalStatistic({ userId: subscription.user.id }, {});
            let studentDto = StudentMapper.toStudentDto(student, statistics);
            const flightList = await this.flightFacade.getFlights({ userId: subscription.user.id }, { limit: 1 })

            if (flightList.length >= 1) {
                studentDto.lastFlight = flightList[0];
            }

            const notes = await this.noteRepository.getNotesByStudentId(student.id);
            if (notes.length >= 0) {
                studentDto.lastNote = NoteMapper.toNoteDto(notes[0]);
            }
            studentDto.controlSheet = await this.controlSheetFacade.getControlSheet({ userId: student.user.id });
            studentDto.emergencyContacts = await this.emergencyContactFacade.getEmergencyContacts({ userId: student.user.id }, {});

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

    async updateTandemStudent(studentId: number): Promise<StudentDto> {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }

        student.isTandem = !student.isTandem;

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

        if (student.isTandem) {
            query["glider-type"] = 1;
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

    async validateStudentFlight(studentId: number, flightId: number, schoolId: number, instructorId: number): Promise<FlightDto> {
        const student = await this.studentRepository.getStudentById(studentId);
        if (!student) {
            throw StudentException.notFoundException();
        }

        const school = await this.schoolRepository.getSchoolById(schoolId);
        if (!school) {
            throw SchoolException.notFoundException();
        }

        return await this.flightFacade.validateFlight({ userId: student.user.id }, flightId, school, instructorId);
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

    async getStudentEmergencyContactsByStudentId(studentId: number): Promise<EmergencyContactDto[]> {
        const student = await this.studentRepository.getStudentById(studentId);

        if (!student) {
            throw StudentException.notFoundException();
        }
        return await this.emergencyContactFacade.getEmergencyContacts({ userId: student.user.id }, {});
    }
}
