import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Put, Query, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SchoolDto } from '../school/interface/school-dto';
import { SchoolFacade } from '../school/school.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompositeAuthGuard } from '../../auth/guard/composite-auth.guard';
import { SchoolGuard } from '../../auth/guard/school.guard';
import { TandemPilotDto } from '../tandem-pilot/interface/tandem-pilot-dto';
import { EnrollmentFacade } from '../enrollment/enrollment.facade';
import { TandemPilotFacade } from '../tandem-pilot/tandem-pilot.facade';
import { PassengerConfirmationDto } from '../../tandem/passenger-confirmation/interface/passenger-confirmation-dto';
import { PagerEntityDto } from '../../interface/pager-entity-dto';
import { EnrollmentWriteDto } from '../enrollment/interface/enrollment-write-dto';
import { EnrollmentDto } from '../enrollment/interface/enrollment-dto';
import { FlightDto } from '../../flight/interface/flight-dto';
import { TandemSchoolDataDto } from '../../flight/interface/tandem-school-data-dto';
import { SchoolConfig } from '../school/domain/school-config';
import { GoogleCalendarService } from '../../shared/services/google-calendar.service';
import { ConfigService } from '@nestjs/config';

@Controller('schools')
@ApiTags('School')
@ApiBearerAuth('jwt')
export class SchoolController {

    constructor(
        private schoolFacade: SchoolFacade,
        private enrollmentFacade: EnrollmentFacade,
        private tandemPilotFacade: TandemPilotFacade,
        private googleCalendarService: GoogleCalendarService,
        private configService: ConfigService
    ) { }

    @UseGuards(CompositeAuthGuard)
    @Post()
    createSchool(@Request() req, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
        return this.schoolFacade.createSchool(req.user, schoolDto);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Put(':id/configuration')
    updateSchoolConfiguration(@Param('id') id: number, @Body() schoolConfigurationDto: SchoolConfig): Promise<SchoolDto> {
        return this.schoolFacade.updateSchoolConfiguration(id, schoolConfigurationDto);
    }

    // TODO: Need permissions for update school.

    // @UseGuards(CompositeAuthGuard)
    // @Put(':id')
    // updateSchool(@Request() req, @Param('id') id: number, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
    //     return this.schoolFacade.updateSchool(req.user, id, schoolDto);
    // }

    // Tandem School endpoints
    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Post('/:id/tandem-pilots/enrollment')
    @HttpCode(204)
    postTandemPilotsEnrollment(@Headers('origin') origin: string, @Param('id') id: number, @Body() enrollmentWriteDto: EnrollmentWriteDto): Promise<EnrollmentDto> {
        return this.enrollmentFacade.createTandemPilotEnrollment(id, enrollmentWriteDto, origin);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get('/:id/tandem-pilots')
    getTandemPilots(@Query('archived') archived: boolean, @Param('id') id: number): Promise<TandemPilotDto[]> {
        return this.tandemPilotFacade.getTandemPilotsBySchoolId(id, archived);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Delete('/:id/tandem-pilots/:tandemPilotId')
    @HttpCode(204)
    async archiveTandemPilot(@Param('id') id: number, @Param('tandemPilotId') tandemPilotId: number): Promise<TandemPilotDto>{
        return await this.tandemPilotFacade.archiveTandemPilot(tandemPilotId);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get('/:id/tandem-pilots/:tandemPilotId/passenger-confirmations')
    getPassengerConfirmationsBySchoolId(@Param('id') id: number, @Query() query: any, @Param('tandemPilotId') tandemPilotId: number): Promise<PagerEntityDto<PassengerConfirmationDto[]>> {
        return this.tandemPilotFacade.getPassengerConfirmationsByTandemPilotId(id, tandemPilotId, query);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get('/:id/tandem-pilots/:tandemPilotId/flights')
    getTandemPilotFlights(@Request() req, @Query() query, @Param('id') id: number, @Param('tandemPilotId') tandemPilotId: number): Promise<PagerEntityDto<FlightDto[]>> {
        return this.tandemPilotFacade.getTandemPilotFlights(id, tandemPilotId, query);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Put('/:id/tandem-pilots/:tandemPilotId/flights/:flightId')
    validateTandemPilotFlight(@Request() req, @Param('id') schoolId: number, @Param('tandemPilotId') tandemPilotId: number, @Param('flightId') flightId: number, @Body() tandemSchoolDataDto: TandemSchoolDataDto): Promise<FlightDto> {
        return this.tandemPilotFacade.validateTandemPilotFlight(tandemPilotId, flightId, schoolId, req.user.userId, tandemSchoolDataDto);
    }

    // Google Calendar endpoints
    @Get('google-calendar/callback')
    async googleCalendarCallback(
        @Query('code') code: string,
        @Query('state') state: string,
        @Query('error') error: string,
        @Res() res: Response
    ) {
        const instructorAppUrl = this.configService.get<string>('INSTRUCTOR_APP_URL');
        
        // Try to extract schoolId from state for all redirects
        let schoolId: number | null = null;
        if (state) {
            try {
                const parsedState = JSON.parse(state);
                schoolId = parsedState.schoolId;
            } catch (e) {
                // Invalid state, continue without schoolId
            }
        }
        
        if (error) {
            const schoolParam = schoolId ? `&school=${schoolId}` : '';
            return res.redirect(`${instructorAppUrl}/configuration?google_calendar=error&message=${error}${schoolParam}`);
        }

        if (!code || !state) {
            const schoolParam = schoolId ? `&school=${schoolId}` : '';
            return res.redirect(`${instructorAppUrl}/configuration?google_calendar=error&message=no_code_or_state${schoolParam}`);
        }

        try {
            await this.schoolFacade.handleGoogleCalendarOAuthCallback(code, schoolId);
            return res.redirect(`${instructorAppUrl}/configuration?google_calendar=success&school=${schoolId}`);
        } catch (err) {
            const schoolParam = schoolId ? `&school=${schoolId}` : '';
            return res.redirect(`${instructorAppUrl}/configuration?google_calendar=error&message=${err.message}${schoolParam}`);
        }
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get(':id/google-calendar/status')
    async getGoogleCalendarStatus(@Param('id') id: number): Promise<{ connected: boolean }> {
        return this.schoolFacade.getGoogleCalendarStatus(id);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get(':id/google-calendar/auth')
    async getGoogleCalendarAuthUrl(@Param('id') id: number): Promise<{ authUrl: string }> {
        return this.schoolFacade.getGoogleCalendarAuthUrl(id);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Delete(':id/google-calendar/disconnect')
    @HttpCode(204)
    async disconnectGoogleCalendar(@Param('id') id: number): Promise<void> {
        await this.schoolFacade.disconnectGoogleCalendar(id);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Get(':id/google-calendar/calendars')
    async getAvailableCalendars(@Param('id') id: number): Promise<Array<{ id: string; summary: string; primary: boolean }>> {
        return this.schoolFacade.getAvailableGoogleCalendars(id);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Put(':id/google-calendar/calendar')
    @HttpCode(204)
    async updateCalendarId(@Param('id') id: number, @Body() body: { calendarId: string }): Promise<void> {
        await this.schoolFacade.updateGoogleCalendarId(id, body.calendarId);
    }
}
