import {
    Controller,
    Get,
    UseGuards,
    Request,
    Query
} from '@nestjs/common';
import { FlightDto } from './interface/flight-dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PagerEntityDto } from '../interface/pager-entity-dto';
import { FlightFacade } from './flight.facade';
import { FlightStatisticDto } from './interface/flight-statistic-dto';
import { StatisticType } from './statistic-type';
import { CompositeAuthGuard } from '../auth/guard/composite-auth.guard';

@Controller({
    path: 'flights',
    version: '2'
})
@ApiTags('Flight v2')
@ApiBearerAuth('jwt')
export class FlightControllerV2 {

    constructor(private flightFacade: FlightFacade) { }

    @UseGuards(CompositeAuthGuard)
    @Get()
    getFlights(@Request() req, @Query() query): Promise<PagerEntityDto<FlightDto[]>> {
        return this.flightFacade.getFlightsPager(req.user, query);
    }

    @UseGuards(CompositeAuthGuard)
    @ApiQuery({ name: 'type', required: true, enum: StatisticType })
    @Get('statistic')
    getStatistic(@Request() req, @Query() query): Promise<FlightStatisticDto[]> {
        return this.flightFacade.getStatisticV2(req.user, query);
    }
}
