import { Controller, Get, Req, UseGuards, Request, Query, Post, Body, Put, Param, Delete, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FlightDto } from './interface/flight-dto';
import { FlightFacade } from './flight.facade';

@Controller('flights')
export class FlightController {

    constructor(private flightFacade: FlightFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getPlaces(@Request() req, @Query() query): Promise<FlightDto[]> {
        return this.flightFacade.getGliders(req.user, query);
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
