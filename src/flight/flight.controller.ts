import { Controller, Get, Req, UseGuards, Request, Query, Post, Body, Put, Param, Delete, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FlightDto } from './interface/flight-dto';
import { FlightFacade } from './flight.facade';
import { FlightStatisticDto } from './interface/flight-statistic-dto';

@Controller('flights')
export class FlightController {

    constructor(private flightFacade: FlightFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getPlaces(@Request() req, @Query() query): Promise<FlightDto[]> {
        return this.flightFacade.getGliders(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('statistic')
    getStatistic(@Request() req, @Query() query): Promise<FlightStatisticDto> {
        return this.flightFacade.getStatistic(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/places/:id/count')
    nbFlightsByPlaceId(@Request() req, @Param('id') id: number) {
        return this.flightFacade.nbFlightsByPlaceId(req.user, id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/gliders/:id/count')
    nbFlightsByGliderId(@Request() req, @Param('id') id: number) {
        return this.flightFacade.nbFlightsByGliderId(req.user, id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createFlight(@Request() req, @Body() flightDto: FlightDto): Promise<FlightDto> {
        return this.flightFacade.createFlight(req.user, flightDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updatePlace(@Request() req, @Param('id') id: number, @Body() flightDto: FlightDto) {
        return this.flightFacade.updateFlight(req.user, id, flightDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async remove(@Request() req, @Param('id') id: number) {
        await this.flightFacade.removeFlight(req.user, id);
    }
}
