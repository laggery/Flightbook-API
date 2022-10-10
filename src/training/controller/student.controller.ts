import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SchoolDto } from 'src/training/school/interface/school-dto';
import { StudentFacade } from 'src/training/student/student.facade';
import { AppointmentFacade } from '../appointment/appointment.facade';
import { AppointmentDto } from '../appointment/interface/appointment-dto';
import { ControlSheetFacade } from '../control-sheet/control-sheet.facade';
import { ControlSheetDto } from '../control-sheet/interface/control-sheet-dto';

@Controller('student')
@ApiTags('Student')
@ApiBearerAuth('jwt')
export class StudentController {

    constructor(
        private studentFacade: StudentFacade,
        private appointmentFacade: AppointmentFacade,
        private controlSheetFacade: ControlSheetFacade
    ){}

    @UseGuards(JwtAuthGuard)
    @Get('schools')
    getSchoolsByUserId(@Request() req): Promise<SchoolDto[]> {
        return this.studentFacade.getSchoolsByUserId(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('schools/:schoolId/appointments')
    async getAppointments(@Param('schoolId') schoolId: number, @Query() query, @Request() req): Promise<AppointmentDto[]> {
        const schools = await this.studentFacade.getSchoolsByUserId(req.user.userId)
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

    @UseGuards(JwtAuthGuard)
    @Post('schools/:schoolId/appointments/:appointmentId/subscriptions')
    async addSubscriptions(@Param('schoolId') schoolId: number, @Param('appointmentId') appointmentId: number, @Request() req): Promise<AppointmentDto> {
        const schools = await this.studentFacade.getSchoolsByUserId(req.user.userId)
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

    @UseGuards(JwtAuthGuard)
    @Delete('schools/:schoolId/appointments/:appointmentId/subscriptions')
    @HttpCode(204)
    async deleteAppointmentSubscription(@I18n() i18n: I18nContext, @Param('schoolId') schoolId: number, @Param('appointmentId') appointmentId: number, @Request() req): Promise<AppointmentDto> {
        const schools = await this.studentFacade.getSchoolsByUserId(req.user.userId)
        const studentInSchool = schools.find((school: SchoolDto) => {
            if (school.id == schoolId) {
                return true;
            }
        });

        if (!studentInSchool) {
            throw new UnauthorizedException();
        }

        return this.appointmentFacade.deleteSubscriptionFromAppointment(appointmentId, req.user.userId, studentInSchool, i18n);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/control-sheet')
    getControlSheet(@Request() req): Promise<ControlSheetDto> {
        return this.controlSheetFacade.getControlSheet(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/control-sheet')
    createUpdateControlSheet(@Request() req, @Body() controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return this.controlSheetFacade.createUpdateControlSheet(req.user, controlSheetDto);
    }
}
