import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { StudentGuard } from 'src/auth/guard/student.guard';
import { ControlSheetDto } from 'src/training/control-sheet/interface/control-sheet-dto';
import { FlightDto } from 'src/flight/interface/flight-dto';
import { StudentFacade } from 'src/training/student/student.facade';
import { SchoolGuard } from 'src/auth/guard/school.guard';
import { AppointmentDto } from '../appointment/interface/appointment-dto';
import { SchoolFacade } from 'src/training/school/school.facade';
import { TeamMemberFacade } from '../team-member/team-member.facade';
import { EnrollmentFacade } from 'src/training/enrollment/enrollment.facade';
import { AppointmentFacade } from '../appointment/appointment.facade';
import { SchoolDto } from 'src/training/school/interface/school-dto';
import { StudentDto } from '../student/interface/student-dto';
import { EnrollmentWriteDto } from 'src/training/enrollment/interface/enrollment-write-dto';
import { EnrollmentDto } from 'src/training/enrollment/interface/enrollment-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PagerEntityDto } from 'src/interface/pager-entity-dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { TeamMemberDto } from '../team-member/interface/team-member-dto';

@Controller('instructor')
@ApiTags('Instructor')
@ApiBearerAuth('jwt')
export class InstructorController {

    constructor(
        private studentFacade: StudentFacade,
        private schoolFacade: SchoolFacade,
        private teamMembersFacade: TeamMemberFacade,
        private enrollmentFacade: EnrollmentFacade,
        private appointmentFacade: AppointmentFacade
    ){}

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

    @UseGuards(JwtAuthGuard)
    @Get('/schools')
    getSchoolsByUserIdAsInstructor(@Request() req): Promise<SchoolDto[]> {
        return this.teamMembersFacade.getSchoolsByUserId(req.user.userId);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/schools/:id/students')
    getStudents(@Request() req, @Param('id') id: number): Promise<StudentDto[]> {
        return this.studentFacade.getStudentsBySchoolId(id);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Delete('/schools/:id/students/:studendId')
    @HttpCode(204)
    removeStudent(@Request() req, @Param('id') schoolId: number, @Param('studendId') studendId: number): Promise<StudentDto> {
        return this.studentFacade.removeStudent(studendId, schoolId);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/schools/:id/team-members')
    getTeamMembers(@Request() req, @Param('id') id: number): Promise<TeamMemberDto[]> {
        return this.teamMembersFacade.getTeamMembersBySchoolId(id);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Post('/schools/:id/students/enrollment')
    @HttpCode(204)
    postStudentsEnrollment(@Headers('origin') origin: string, @Param('id') id: number, @Body() enrollmentWriteDto: EnrollmentWriteDto): Promise<EnrollmentDto> {
        return this.enrollmentFacade.createStudentEnrollment(id, enrollmentWriteDto, origin);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Post('/schools/:id/team-members/enrollment')
    @HttpCode(204)
    postTeamMemberEnrollment(@Headers('origin') origin: string, @Param('id') id: number, @Body() enrollmentWriteDto: EnrollmentWriteDto): Promise<EnrollmentDto> {
        return this.enrollmentFacade.createTeamMemberEnrollment(id, enrollmentWriteDto, origin);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Delete('/schools/:id/team-members/:teamMemberId')
    @HttpCode(204)
    deleteTeamMember(@Param('id') id: number, @Param('teamMemberId') teamMemberId: number): Promise<TeamMemberDto>{
        return this.teamMembersFacade.deleteTeamMember(teamMemberId);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Post('/schools/:id/appointments')
    async postAppointment(@I18n() i18n: I18nContext, @Param('id') id: number, @Body() appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        return this.appointmentFacade.createAppointment(id, appointmentDto, i18n);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Put('/schools/:id/appointments/:appointment_id')
    putAppointment(@Param('id') id: number, @Param('appointment_id') appointmentId: number, @Body() appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        return this.appointmentFacade.updateAppointment(appointmentId, id, appointmentDto);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/schools/:id/appointments')
    getAppointments(@Param('id') id: number, @Query() query): Promise<PagerEntityDto<AppointmentDto[]>> {
        return this.appointmentFacade.getAppointmentsBySchoolId(id, query);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/schools/:id/appointments/:appointment_id/students')
    getAppointmentSubscriptions(@Param('id') id: number, @Param('appointment_id') appointmentId: number): Promise<StudentDto[]> {
        return this.studentFacade.getStudentsByAppointmentId(appointmentId);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Get('/students/:id/flights')
    getStudentDetail(@Request() req, @Param('id') id: number): Promise<FlightDto[]> {
        return this.studentFacade.getStudentFlightsByStudentId(id);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Get('/students/:id/control-sheet')
    getControlSheet(@Request() req, @Param('id') id: number): Promise<ControlSheetDto> {
        return this.studentFacade.getStudentControlSheetByStudentId(id);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Post('/students/:id/control-sheet')
    postControlSheet(@Request() req, @Param('id') id: number, @Body() controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return this.studentFacade.postStudentControlSheetByStudentId(id, controlSheetDto);
    }
}
