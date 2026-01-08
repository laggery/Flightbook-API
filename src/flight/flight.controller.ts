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
import { FlightDto } from './interface/flight-dto';
import { FlightFacade } from './flight.facade';
import { FlightStatisticDto } from './interface/flight-statistic-dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompositeAuthGuard } from '../auth/guard/composite-auth.guard';
import { FlightValidationState } from './flight-validation-state';
@Controller('flights')
@ApiTags('Flight')
@ApiBearerAuth('jwt')
export class FlightController {

    constructor(private flightFacade: FlightFacade) { }

    @ApiOperation({deprecated: true})
    @UseGuards(CompositeAuthGuard)
    @Get()
    @ApiQuery({ name: 'validation-state', required: false, enum: FlightValidationState })
    getFlights(@Request() req, @Query() query): Promise<FlightDto[]> {
        return this.flightFacade.getFlights(req.user, query);
    }

    @UseGuards(CompositeAuthGuard)
    @ApiQuery({ name: 'years', required: false })
    @ApiQuery({ name: 'validation-state', required: false, enum: FlightValidationState })
    @Get('statistic')
    getStatistic(@Request() req, @Query() query): Promise<FlightStatisticDto | FlightStatisticDto[]> {
        return this.flightFacade.getStatisticV1(req.user, query);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('/:id')
    getFlightById(@Request() req, @Param('id') id: number): Promise<FlightDto> {
        return this.flightFacade.getFlightById(req.user, id);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('/places/:id/count')
    nbFlightsByPlaceId(@Request() req, @Param('id') id: number) {
        return this.flightFacade.nbFlightsByPlaceId(req.user, id);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('/gliders/:id/count')
    nbFlightsByGliderId(@Request() req, @Param('id') id: number) {
        return this.flightFacade.nbFlightsByGliderId(req.user, id);
    }

    @UseGuards(CompositeAuthGuard)
    @Post()
    createFlight(@Request() req, @Body() flightDto: FlightDto): Promise<FlightDto> {
        return this.flightFacade.createFlight(req.user, flightDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Put(':id')
    updateFlight(@Request() req, @Param('id') id: number, @Body() flightDto: FlightDto) {
        return this.flightFacade.updateFlight(req.user, id, flightDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async remove(@Request() req, @Param('id') id: number) {
        await this.flightFacade.removeFlight(req.user, id);
    }
}
