import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { StudentGuard } from '../../auth/guard/student.guard';
import { ControlSheetDto } from '../../training/control-sheet/interface/control-sheet-dto';
import { FlightDto } from '../../flight/interface/flight-dto';
import { StudentFacade } from '../../training/student/student.facade';
import { SchoolGuard } from '../../auth/guard/school.guard';
import { AppointmentDto } from '../appointment/interface/appointment-dto';
import { TeamMemberFacade } from '../team-member/team-member.facade';
import { EnrollmentFacade } from '../../training/enrollment/enrollment.facade';
import { AppointmentFacade } from '../appointment/appointment.facade';
import { SchoolDto } from '../../training/school/interface/school-dto';
import { StudentDto } from '../student/interface/student-dto';
import { EnrollmentWriteDto } from '../../training/enrollment/interface/enrollment-write-dto';
import { EnrollmentDto } from '../../training/enrollment/interface/enrollment-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PagerEntityDto } from '../../interface/pager-entity-dto';
import { TeamMemberDto } from '../team-member/interface/team-member-dto';
import { AppointmentTypeFacade } from '../appointment/appointment-type.facade';
import { AppointmentTypeDto } from '../appointment/interface/appointment-type-dto';
import { NoteDto } from '../note/interface/note-dto';
import { NoteFacade } from '../note/note.facade';
import { CompositeAuthGuard } from '../../auth/guard/composite-auth.guard';
import { EmergencyContactDto } from '../emergency-contact/interface/emergency-contact-dto';
import { FlightValidationDto } from '../../flight/interface/flight-validation-dto';

@Controller('instructor')
@ApiTags('Instructor')
@ApiBearerAuth('jwt')
export class InstructorController {

    constructor(
        private studentFacade: StudentFacade,
        private teamMembersFacade: TeamMemberFacade,
        private enrollmentFacade: EnrollmentFacade,
        private appointmentFacade: AppointmentFacade,
        private appointmentTypeFacade: AppointmentTypeFacade,
        private noteFacade: NoteFacade
    ){}

    @UseGuards(CompositeAuthGuard)
    @Get('/schools')
    getSchoolsByUserIdAsInstructor(@Request() req): Promise<SchoolDto[]> {
        return this.teamMembersFacade.getSchoolsByUserId(req.user.userId);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get('/schools/:id/students')
    getStudents(@Query('archived') archived: boolean, @Param('id') id: number): Promise<StudentDto[]> {
        return this.studentFacade.getStudentsBySchoolId(id, archived);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get('/schools/:id/team-members')
    getTeamMembers(@Request() req, @Param('id') id: number): Promise<TeamMemberDto[]> {
        return this.teamMembersFacade.getTeamMembersBySchoolId(id);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Post('/schools/:id/students/enrollment')
    @HttpCode(204)
    postStudentsEnrollment(@Headers('origin') origin: string, @Param('id') id: number, @Body() enrollmentWriteDto: EnrollmentWriteDto): Promise<EnrollmentDto> {
        return this.enrollmentFacade.createStudentEnrollment(id, enrollmentWriteDto, origin);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Post('/schools/:id/team-members/enrollment')
    @HttpCode(204)
    postTeamMemberEnrollment(@Headers('origin') origin: string, @Param('id') id: number, @Body() enrollmentWriteDto: EnrollmentWriteDto): Promise<EnrollmentDto> {
        return this.enrollmentFacade.createTeamMemberEnrollment(id, enrollmentWriteDto, origin);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Delete('/schools/:id/team-members/:teamMemberId')
    @HttpCode(204)
    deleteTeamMember(@Param('id') id: number, @Param('teamMemberId') teamMemberId: number): Promise<TeamMemberDto>{
        return this.teamMembersFacade.deleteTeamMember(teamMemberId);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Post('/schools/:id/appointments')
    async postAppointment(@Param('id') id: number, @Body() appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        return this.appointmentFacade.createAppointment(id, appointmentDto);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Put('/schools/:id/appointments/:appointment_id')
    putAppointment(@Param('id') id: number, @Param('appointment_id') appointmentId: number, @Body() appointmentDto: AppointmentDto): Promise<AppointmentDto> {
        return this.appointmentFacade.updateAppointment(appointmentId, id, appointmentDto);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get('/schools/:id/appointments')
    getAppointments(@Param('id') id: number, @Query() query): Promise<PagerEntityDto<AppointmentDto[]>> {
        return this.appointmentFacade.getAppointmentsBySchoolId(id, query);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get('/schools/:id/appointments/:appointment_id/students')
    getAppointmentSubscriptions(@Param('id') id: number, @Param('appointment_id') appointmentId: number): Promise<StudentDto[]> {
        return this.studentFacade.getStudentsByAppointmentId(appointmentId);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get('/schools/:id/appointment-types')
    getAppointmentType(@Param('id') id: number, @Query() query): Promise<AppointmentTypeDto[]> {
        return this.appointmentTypeFacade.getAppointmentTypesBySchoolId(id, query);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Post('/schools/:id/appointment-types')
    postAppointmentType(@Param('id') id: number, @Body() appointmentTypeDto: AppointmentTypeDto): Promise<AppointmentTypeDto> {
        return this.appointmentTypeFacade.createAppointmentType(id, appointmentTypeDto);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Put('/schools/:id/appointment-types/:appointmentTypes_id')
    putAppointmentType(@Param('id') id: number, @Param('appointmentTypes_id') appointmentTypeId: number, @Body() appointmentTypeDto: AppointmentTypeDto): Promise<AppointmentTypeDto> {
        return this.appointmentTypeFacade.updateAppointmentType(appointmentTypeId, id, appointmentTypeDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('/appointments')
    getAppointmentsByInstructorId(@Request() req, @Query() query): Promise<PagerEntityDto<AppointmentDto[]>> {
        return this.appointmentFacade.getAppointmentsByInstructorId(req.user.userId, query);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Put('/schools/:school_id/students/:id/flights/validate-all')
    @HttpCode(204)
    async validateAllStudentFlight(@Request() req, @Param('school_id') schoolId: number, @Param('id') id: number, @Body() flightValidationDto: FlightValidationDto) {
        return await this.studentFacade.validateAllStudentFlight(id, schoolId, req.user.userId, flightValidationDto);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Put('/schools/:school_id/students/:id/flights/:flightId')
    validateStudentFlight(@Request() req, @Param('school_id') schoolId: number, @Param('id') id: number, @Param('flightId') flightId: number, @Body() flightValidationDto: FlightValidationDto): Promise<FlightDto> {
        return this.studentFacade.validateStudentFlight(id, flightId, schoolId, req.user.userId, flightValidationDto);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Delete('/students/:id')
    @HttpCode(204)
    async removeStudent(@Request() req, @Param('id') studendId: number): Promise<StudentDto> {
        return await this.studentFacade.archiveStudent(studendId);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Get('/students/:id/flights')
    getStudentFlights(@Request() req, @Query() query, @Param('id') id: number): Promise<PagerEntityDto<FlightDto[]>> {
        return this.studentFacade.getStudentFlightsByStudentId(id, query);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Put('/students/:id/flights/:flightId')
    updateStudentFlight(@Request() req, @Param('id') id: number, @Param('flightId') flightId: number, @Body() flightDto: FlightDto): Promise<FlightDto> {
        return this.studentFacade.updateStudentFlight(id, flightId, flightDto);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Put('/students/:id/tandem')
    updateStudentType(@Request() req, @Param('id') id: number): Promise<StudentDto> {
        return this.studentFacade.updateTandemStudent(id);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Get('/students/:id/control-sheet')
    getControlSheet(@Request() req, @Param('id') id: number): Promise<ControlSheetDto> {
        return this.studentFacade.getStudentControlSheetByStudentId(id);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Post('/students/:id/control-sheet')
    postControlSheet(@Request() req, @Param('id') id: number, @Body() controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return this.studentFacade.postStudentControlSheetByStudentId(id, controlSheetDto);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Get('/students/:id/emergency-contacts')
    getEmergencyContacts(@Request() req, @Param('id') id: number): Promise<EmergencyContactDto[]> {
        return this.studentFacade.getStudentEmergencyContactsByStudentId(id);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Post('/students/:id/notes')
    postNotes(@Request() req, @Param('id') id: number, @Body() noteDto: NoteDto): Promise<NoteDto> {
        return this.noteFacade.createNote(id, noteDto);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Put('/students/:id/notes/:noteId')
    putNotes(@Request() req, @Param('id') id: number, @Param('noteId') noteId: number, @Body() noteDto: NoteDto): Promise<NoteDto> {
        return this.noteFacade.updateNote(noteId, id, noteDto);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Get('/students/:id/notes')
    getNotes(@Request() req, @Query() query, @Param('id') id: number): Promise<PagerEntityDto<NoteDto[]>> {
        return this.noteFacade.getNotesByStudentId(id, query);
    }

    @UseGuards(CompositeAuthGuard, StudentGuard)
    @Delete('/students/:id/notes/:noteId')
    @HttpCode(204)
    async removeNote(@Request() req, id: number, @Param('noteId') noteId: number, @Param('studendId') studendId: number) {
        await this.noteFacade.removeNote(noteId);
    }
}
