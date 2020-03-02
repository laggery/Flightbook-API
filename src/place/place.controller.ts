import { Controller, Get, Post, Body, HttpCode, Put, Param, Delete, Query } from '@nestjs/common';
import { PlaceDto } from './interface/place-dto';
import { PlaceFacade } from './place.facade';

@Controller('places')
export class PlaceController {

    constructor(private placeFacade: PlaceFacade) { }

    @Get()
    getPlaces(@Query() query): Promise<PlaceDto[]> {
        return this.placeFacade.getPlaces(query);
    }

    @Post()
    createPlace(@Body() placeDto: PlaceDto): Promise<PlaceDto> {
        return this.placeFacade.createPlace(placeDto);
    }

    @Put(':id')
    updatePlace(@Param('id') id: number, @Body() placeDto: PlaceDto) {
        return this.placeFacade.updatePlace(id, placeDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id: number) {
        await this.placeFacade.removePlace(id);
    }
}