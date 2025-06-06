import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SchoolDto } from '../../training/school/interface/school-dto';
import { StudentFacade } from '../../training/student/student.facade';
import { AppointmentFacade } from '../appointment/appointment.facade';
import { AppointmentDto } from '../appointment/interface/appointment-dto';
import { ControlSheetFacade } from '../control-sheet/control-sheet.facade';
import { ControlSheetDto } from '../control-sheet/interface/control-sheet-dto';
import { TeamMemberFacade } from '../team-member/team-member.facade';
import { EnrollmentFacade } from '../enrollment/enrollment.facade';
import { CompositeAuthGuard } from '../../auth/guard/composite-auth.guard';
import { EmergencyContactFacade } from '../emergency-contact/emergency-contact.facade';
import { EmergencyContactDto } from '../emergency-contact/interface/emergency-contact-dto';

@Controller('student')
@ApiTags('Student')
@ApiBearerAuth('jwt')
export class StudentController {

    constructor(
        private studentFacade: StudentFacade,
        private appointmentFacade: AppointmentFacade,
        private controlSheetFacade: ControlSheetFacade,
        private teamMemberFacade: TeamMemberFacade,
        private enrollmentFacade: EnrollmentFacade,
        private emergencyContactFacade: EmergencyContactFacade
    ){}

    @UseGuards(CompositeAuthGuard)
    @Get('schools')
    getSchoolsByUserId(@Request() req): Promise<SchoolDto[]> {
        return this.studentFacade.getActiveSchoolsByUserId(req.user.userId);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('schools/:schoolId/appointments')
    async getAppointments(@Param('schoolId') schoolId: number, @Query() query, @Request() req): Promise<AppointmentDto[]> {
        const schools = await this.studentFacade.getActiveSchoolsByUserId(req.user.userId)
        const studentInSchool = schools.find((school: SchoolDto) => {
            if (school.id == schoolId) {
                return true;
            }
        });

        if (!studentInSchool) {
            throw new UnauthorizedException();
        }

        return await (await this.appointmentFacade.getAppointmentsBySchoolId(schoolId, query)).entity;
    }

    @UseGuards(CompositeAuthGuard)
    @Get('schools/:schoolId/appointments/:appointmentId')
    async getAppointment(@Param('schoolId') schoolId: number, @Param('appointmentId') appointmentId: number, @Query() query, @Request() req): Promise<AppointmentDto> {
        const schools = await this.studentFacade.getActiveSchoolsByUserId(req.user.userId)
        const studentInSchool = schools.find((school: SchoolDto) => {
            if (school.id == schoolId) {
                return true;
            }
        });

        if (!studentInSchool) {
            throw new UnauthorizedException();
        }

        return this.appointmentFacade.getAppointmentById(appointmentId);
    }

    @UseGuards(CompositeAuthGuard)
    @Post('schools/:schoolId/appointments/:appointmentId/subscriptions')
    async addSubscriptions(@Param('schoolId') schoolId: number, @Param('appointmentId') appointmentId: number, @Request() req): Promise<AppointmentDto> {
        const schools = await this.studentFacade.getActiveSchoolsByUserId(req.user.userId)
        const studentInSchool = schools.find((school: SchoolDto) => {
            if (school.id == schoolId) {
                return true;
            }
        });

        if (!studentInSchool) {
            throw new UnauthorizedException();
        }

        return this.appointmentFacade.addSubscriptionToAppointment(appointmentId, req.user.userId);
    }

    @UseGuards(CompositeAuthGuard)
    @Delete('schools/:schoolId/appointments/:appointmentId/subscriptions')
    @HttpCode(204)
    async deleteAppointmentSubscription(@Param('schoolId') schoolId: number, @Param('appointmentId') appointmentId: number, @Request() req): Promise<AppointmentDto> {
        const schools = await this.studentFacade.getActiveSchoolsByUserId(req.user.userId)
        const studentInSchool = schools.find((school: SchoolDto) => {
            if (school.id == schoolId) {
                return true;
            }
        });

        if (!studentInSchool) {
            throw new UnauthorizedException();
        }

        return this.appointmentFacade.deleteSubscriptionFromAppointment(appointmentId, req.user.userId, studentInSchool);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('schools/:schoolId/enrollment/:token/free')
    async hasFreeEnrollment(@Param('schoolId') schoolId: number, @Param('token') token: string, @Request() req): Promise<any> {
        return await this.enrollmentFacade.isFreeEnrollment(token) || await this.teamMemberFacade.isUserTeamMemberFromSchool(schoolId, req.user.userId);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('/control-sheet')
    getControlSheet(@Request() req): Promise<ControlSheetDto> {
        return this.controlSheetFacade.getControlSheet(req.user);
    }

    @UseGuards(CompositeAuthGuard)
    @Post('/control-sheet')
    createUpdateControlSheet(@Request() req, @Body() controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return this.controlSheetFacade.studentCreateUpdateControlSheet(req.user, controlSheetDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('/emergency-contacts')
    getEmergencyContacts(@Request() req): Promise<EmergencyContactDto[]> {
        return this.emergencyContactFacade.getEmergencyContacts(req.user, {});
    }

    @UseGuards(CompositeAuthGuard)
    @Post('/emergency-contacts')
    createUpdateEmergencyContact(@Request() req, @Body() emergencyContactDto: EmergencyContactDto): Promise<EmergencyContactDto> {
        return this.emergencyContactFacade.createUpdateEmergencyContact(req.user, emergencyContactDto);
    }
}
