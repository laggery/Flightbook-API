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
import { TeamMemberDto } from '../team-member/interface/team-member-dto';
import { AppointmentTypeFacade } from '../appointment/appointment-type.facade';
import { AppointmentTypeDto } from '../appointment/interface/appointment-type-dto';
import { ArchivedStudentGuard } from 'src/auth/guard/archived-student.guard';
import { NoteDto } from '../note/interface/note-dto';
import { NoteFacade } from '../note/note.facade';

@Controller('instructor')
@ApiTags('Instructor')
@ApiBearerAuth('jwt')
export class InstructorController {

    constructor(
        private studentFacade: StudentFacade,
        private schoolFacade: SchoolFacade,
        private teamMembersFacade: TeamMemberFacade,
        private enrollmentFacade: EnrollmentFacade,
        private appointmentFacade: AppointmentFacade,
        private appointmentTypeFacade: AppointmentTypeFacade,
        private noteFacade: NoteFacade
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
    @Get('/schools/:id/students/archived')
    getArchivedStudents(@Request() req, @Param('id') id: number): Promise<StudentDto[]> {
        return this.studentFacade.getArchivedStudentsBySchoolId(id);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Delete('/schools/:id/students/:studendId')
    @HttpCode(204)
    removeStudent(@Request() req, @Param('id') schoolId: number, @Param('studendId') studendId: number): Promise<StudentDto> {
        return this.studentFacade.removeStudent(studendId);
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
    async postAppointment(@Param('id') id: number, @Body() appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        return this.appointmentFacade.createAppointment(id, appointmentDto);
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

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/schools/:id/appointment-types')
    getAppointmentType(@Param('id') id: number, @Query() query): Promise<AppointmentTypeDto[]> {
        return this.appointmentTypeFacade.getAppointmentTypesBySchoolId(id, query);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Post('/schools/:id/appointment-types')
    postAppointmentType(@Param('id') id: number, @Body() appointmentTypeDto: AppointmentTypeDto): Promise<AppointmentTypeDto> {
        return this.appointmentTypeFacade.createAppointmentType(id, appointmentTypeDto);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Put('/schools/:id/appointment-types/:appointmentTypes_id')
    putAppointmentType(@Param('id') id: number, @Param('appointmentTypes_id') appointmentTypeId: number, @Body() appointmentTypeDto: AppointmentTypeDto): Promise<AppointmentTypeDto> {
        return this.appointmentTypeFacade.updateAppointmentType(appointmentTypeId, id, appointmentTypeDto);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Get('/students/:id/flights')
    getStudentFlights(@Request() req, @Query() query, @Param('id') id: number): Promise<PagerEntityDto<FlightDto[]>> {
        return this.studentFacade.getStudentFlightsByStudentId(id, query);
    }

    @UseGuards(JwtAuthGuard, ArchivedStudentGuard)
    @Get('/students/archived/:id/flights')
    getArchivedStudentDetail(@Request() req, @Query() query, @Param('id') studentId: number): Promise<PagerEntityDto<FlightDto[]>> {
        return this.studentFacade.getArchivedStudentFlightsByStudentId(studentId, query);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Get('/students/:id/control-sheet')
    getControlSheet(@Request() req, @Param('id') id: number): Promise<ControlSheetDto> {
        return this.studentFacade.getStudentControlSheetByStudentId(id, false);
    }

    @UseGuards(JwtAuthGuard, ArchivedStudentGuard)
    @Get('/students/archived/:id/control-sheet')
    getControlSheetArchivedStudent(@Request() req, @Param('id') id: number): Promise<ControlSheetDto> {
        return this.studentFacade.getStudentControlSheetByStudentId(id, true);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Post('/students/:id/control-sheet')
    postControlSheet(@Request() req, @Param('id') id: number, @Body() controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return this.studentFacade.postStudentControlSheetByStudentId(id, controlSheetDto);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Post('/students/:id/notes')
    postNotes(@Request() req, @Param('id') id: number, @Body() noteDto: NoteDto): Promise<NoteDto> {
        return this.noteFacade.createNote(id, noteDto);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Post('/students/:id/notes/:noteId')
    putNotes(@Request() req, @Param('id') id: number, @Param('noteId') noteId: number, @Body() noteDto: NoteDto): Promise<NoteDto> {
        return this.noteFacade.updateNote(noteId, id, noteDto);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Get('/students/:id/notes')
    getNotes(@Request() req, @Query() query, @Param('id') id: number): Promise<PagerEntityDto<NoteDto[]>> {
        return this.noteFacade.getNotesByStudentId(id, query);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Delete('/students/:id/notes/:noteId')
    @HttpCode(204)
    removeNote(@Request() req, id: number, @Param('noteId') noteId: number, @Param('studendId') studendId: number) {
        this.noteFacade.removeNote(noteId);
    }

    @UseGuards(JwtAuthGuard, ArchivedStudentGuard)
    @Get('/students/archived/:id/notes')
    getArchivedNotes(@Request() req, @Query() query, @Param('id') id: number): Promise<PagerEntityDto<NoteDto[]>> {
        return this.noteFacade.getNotesByStudentId(id, query);
    }
}
