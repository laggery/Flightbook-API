import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppointmentFacade } from 'src/agenda/appointment/appointment.facade';
import { AppointmentDto } from 'src/agenda/appointment/interface/appointment-dto';
import { SubscriptionDto } from 'src/agenda/subscription/interface/subscription-dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { StudentGuard } from 'src/auth/guard/student.guard';
import { ControlSheetDto } from 'src/control-sheet/interface/control-sheet-dto';
import { FlightDto } from 'src/flight/interface/flight-dto';
import { SchoolDto } from 'src/school/interface/school-dto';
import { StudentFacade } from './student.facade';

@Controller('students')
@ApiTags('Student')
@ApiBearerAuth('jwt')
export class StudentController {

    constructor(private studentFacade: StudentFacade, private appointmentFacade: AppointmentFacade){}

    @UseGuards(JwtAuthGuard)
    @Get('schools')
    getSchoolsByUserIdAsStudent(@Request() req): Promise<SchoolDto[]> {
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

        return this.appointmentFacade.getAppointmentsBySchoolId(schoolId, query);
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

        return this.appointmentFacade.addSubscriptionToAppointment(appointmentId, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('schools/:schoolId/appointments/:appointmentId/subscriptions')
    @HttpCode(204)
    async deleteAppointmentSubscription(@Param('schoolId') schoolId: number, @Param('appointmentId') appointmentId: number, @Request() req): Promise<AppointmentDto> {
        const schools = await this.studentFacade.getSchoolsByUserId(req.user.userId)
        const studentInSchool = schools.find((school: SchoolDto) => {
            if (school.id == schoolId) {
                return true;
            }
        });

        return this.appointmentFacade.deleteSubscriptionFromAppointment(appointmentId, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Get('/:id/flights')
    getStudentDetail(@Request() req, @Param('id') id: number): Promise<FlightDto[]> {
        return this.studentFacade.getStudentFlightsByStudentId(id);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Get('/:id/control-sheet')
    getControlSheet(@Request() req, @Param('id') id: number): Promise<ControlSheetDto> {
        return this.studentFacade.getStudentControlSheetByStudentId(id);
    }

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Post('/:id/control-sheet')
    postControlSheet(@Request() req, @Param('id') id: number, @Body() controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return this.studentFacade.postStudentControlSheetByStudentId(id, controlSheetDto);
    }
}
