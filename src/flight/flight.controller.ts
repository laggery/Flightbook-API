import {
    Controller,
    Get,
    UseGuards,
    Request,
    Query,
    Post,
    Body,
    Put,
    Param,
    Delete,
    HttpCode
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FlightDto } from './interface/flight-dto';
import { FlightFacade } from './flight.facade';
import { FlightStatisticDto } from './interface/flight-statistic-dto';
import { PagerDto } from 'src/interface/pager-dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
@Controller('flights')
@ApiTags('Flight')
@ApiBearerAuth('jwt')
export class FlightController {

    constructor(private flightFacade: FlightFacade) { }

    @ApiOperation({deprecated: true})
    @UseGuards(JwtAuthGuard)
    @Get()
    getFlights(@Request() req, @Query() query): Promise<FlightDto[]> {
        return this.flightFacade.getFlights(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('pager')
    getFlightsPager(@Request() req, @Query() query): Promise<PagerDto> {
        return this.flightFacade.getFlightsPager(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @ApiQuery({ name: 'years', required: false })
    @Get('statistic')
    getStatistic(@Request() req, @Query() query): Promise<FlightStatisticDto | FlightStatisticDto[]> {
        return this.flightFacade.getStatisticV1(req.user, query);
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
