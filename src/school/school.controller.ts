import { Body, Controller, Get, Headers, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SchoolGuard } from 'src/auth/guard/school.guard';
import { EnrollmentDto } from 'src/enrollment/interface/enrollment-dto';
import { EnrollmentWriteDto } from 'src/enrollment/interface/enrollment-write-dto';
import { EnrollmentFacade } from 'src/enrollment/enrollment.facade';
import { StudentDto } from 'src/student/interface/student-dto';
import { StudentFacade } from 'src/student/student.facade';
import { SchoolDto } from './interface/school-dto';
import { SchoolFacade } from './school.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {AppointmentDto} from "../agenda/appointment/interface/appointment-dto";
import {SubscriptionDto} from "../agenda/subscription/interface/subscription-dto";
import { AppointmentFacade } from 'src/agenda/appointment/appointment.facade';
import { TeamMemberFacade } from 'src/team-member/team-member.facade';
import { UserReadDto } from 'src/user/interface/user-read-dto';

@Controller('schools')
@ApiTags('School')
@ApiBearerAuth('jwt')
export class SchoolController {

    constructor(
        private schoolFacade: SchoolFacade,
        private studentFacade: StudentFacade,
        private teamMembersFacade: TeamMemberFacade,
        private studentEnrollmentFacade: EnrollmentFacade,
        private appointmentFacade: AppointmentFacade
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createSchool(@Request() req, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
        return this.schoolFacade.createSchool(req.user, schoolDto);
    }

    // TODO: Need permissions for update school.

    // @UseGuards(JwtAuthGuard)
    // @Put(':id')
    // updateSchool(@Request() req, @Param('id') id: number, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
    //     return this.schoolFacade.updateSchool(req.user, id, schoolDto);
    // }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/:id/students')
    getStudents(@Request() req, @Param('id') id: number): Promise<StudentDto[]> {
        return this.studentFacade.getStudentsBySchoolId(id);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/:id/team-members')
    getTeamMembers(@Request() req, @Param('id') id: number): Promise<UserReadDto[]> {
        return this.teamMembersFacade.getUsersBySchoolId(id);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Post('/:id/students/enrollment')
    @HttpCode(204)
    postStudentsEnrollment(@Headers('origin') origin: string, @Param('id') id: number, @Body() studentEnrollmentWriteDto: EnrollmentWriteDto): Promise<EnrollmentDto> {
        return this.studentEnrollmentFacade.createStudentEnrollment(id, studentEnrollmentWriteDto, origin);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Post('/:id/appointments')
    postAppointment(@Param('id') id: number, @Body() appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        return this.appointmentFacade.createAppointment(id, appointmentDto);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Put('/:id/appointments/:appointment_id')
    putAppointment(@Param('id') id: number, @Param('appointment_id') appointmentId: number, @Body() appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        return this.appointmentFacade.updateAppointment(appointmentId, id, appointmentDto);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/:id/appointments')
    getAppointments(@Param('id') id: number, @Query() query): Promise<AppointmentDto[]> {
        return this.appointmentFacade.getAppointmentsBySchoolId(id, query);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/:id/appointments/:appointment_id/students')
    getAppointmentSubscriptions(@Param('id') id: number, @Param('appointment_id') appointmentId: number): Promise<StudentDto[]> {
        return this.studentFacade.getStudentsByAppointmentId(appointmentId);
    }
}
