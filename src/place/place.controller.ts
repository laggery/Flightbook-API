import { Controller, Get, Post, Body, HttpCode, Put, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PlaceDto } from './interface/place-dto';
import { PlaceFacade } from './place.facade';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('places')
export class PlaceController {

    constructor(private placeFacade: PlaceFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getPlaces(@Request() req, @Query() query): Promise<PlaceDto[]> {
        return this.placeFacade.getPlaces(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createPlace(@Request() req, @Body() placeDto: PlaceDto): Promise<PlaceDto> {
        return this.placeFacade.createPlace(req.user, placeDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updatePlace(@Request() req, @Param('id') id: number, @Body() placeDto: PlaceDto) {
        return this.placeFacade.updatePlace(req.user, id, placeDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async remove(@Request() req, @Param('id') id: number) {
        await this.placeFacade.removePlace(req.user, id);
    }
}