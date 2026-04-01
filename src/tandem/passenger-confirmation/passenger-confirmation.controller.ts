import { Body, Controller, Get, Param, Post, Query, UseGuards, Request, ValidationPipe, Delete, HttpCode } from '@nestjs/common';
import { CompositeAuthGuard } from '../../auth/guard/composite-auth.guard';
import { PassengerConfirmationDto } from './interface/passenger-confirmation-dto';
import { PassengerConfirmationFacade } from './passenger-confirmation.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('passenger-confirmations')
@ApiTags('Passenger Confirmations')
@ApiBearerAuth('jwt')
export class PassengerConfirmationController {

    constructor(
        private readonly passengerConfirmationFacade: PassengerConfirmationFacade
    ) { }

    @UseGuards(CompositeAuthGuard)
    @Post()
    async postPassengerConfirmation(@Request() req, @Body(new ValidationPipe({ transform: true }))  passengerConfirmationDto: PassengerConfirmationDto): Promise<PassengerConfirmationDto> {
        return this.passengerConfirmationFacade.createPassengerConfirmation(req.user.userId, passengerConfirmationDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Get()
    async getPassengerConfirmations(@Request() req, @Query() query): Promise<PassengerConfirmationDto[]> {
        return (await this.passengerConfirmationFacade.getPassengerConfirmations(req.user.userId, query)).entity;
    }

    @UseGuards(CompositeAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async remove(@Request() req, @Param('id') id: number) {
        await this.passengerConfirmationFacade.deletePassengerConfirmation(req.user.userId, id);
    }
}
