import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { SchoolDto } from '../school/interface/school-dto';
import { SchoolFacade } from '../school/school.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompositeAuthGuard } from '../../auth/guard/composite-auth.guard';
import { SchoolConfigurationDto } from '../school/interface/school-configuration-dto';
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

@Controller('schools')
@ApiTags('School')
@ApiBearerAuth('jwt')
export class SchoolController {

    constructor(
        private schoolFacade: SchoolFacade,
        private enrollmentFacade: EnrollmentFacade,
        private tandemPilotFacade: TandemPilotFacade
    ) { }

    @UseGuards(CompositeAuthGuard)
    @Post()
    createSchool(@Request() req, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
        return this.schoolFacade.createSchool(req.user, schoolDto);
    }

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Put(':id/configuration')
    updateSchoolConfiguration(@Param('id') id: number, @Body() schoolConfigurationDto: SchoolConfigurationDto): Promise<SchoolDto> {
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
        return this.tandemPilotFacade.getPassengerConfirmationsByTandemPilotId(tandemPilotId, query);
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
}
