import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SchoolDto } from '../school/interface/school-dto';
import { CompositeAuthGuard } from '../../auth/guard/composite-auth.guard';
import { TandemPilotFacade } from '../tandem-pilot/tandem-pilot.facade';

@Controller('tandem-pilot')
@ApiTags('Tandem Pilot')
@ApiBearerAuth('jwt')
export class TandemPilotController {

    constructor(
        private tandemPilotFacade: TandemPilotFacade
    ){}

    @UseGuards(CompositeAuthGuard)
    @Get('schools')
    getTandemSchoolsByUserId(@Request() req): Promise<SchoolDto[]> {
        return this.tandemPilotFacade.getTandemSchoolsByUserId(req.user.userId);
    }
}
