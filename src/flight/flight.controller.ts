import { Controller, Get, Req } from '@nestjs/common';
import { FlightService } from './flight.service';

@Controller('flights')
export class FlightController {

    constructor(private flightService: FlightService) { }

    @Get()
    async getFlights(@Req() req) {
        console.log(req.cookies);
        const flights = await this.flightService.getFLights();
        return flights;
    }
}
