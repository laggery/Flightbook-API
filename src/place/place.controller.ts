import { Controller, Get, Post, Body, HttpCode, Put, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PlaceDto } from './interface/place-dto';
import { PlaceFacade } from './place.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FeatureCollection } from 'geojson';
import { CompositeAuthGuard } from '../auth/guard/composite-auth.guard';

@Controller('places')
@ApiTags('Place')
@ApiBearerAuth('jwt')
export class PlaceController {

    constructor(
        private placeFacade: PlaceFacade
    ) {}

    @UseGuards(CompositeAuthGuard)
    @Get("metadata")
    getElevationByCoordinates(@Request() req, @Query() query): Promise<PlaceDto> {
        return this.placeFacade.getPlaceMetadata(query);
    }

    @UseGuards(CompositeAuthGuard)
    @Get("openstreetmap/:name")
    searchOpenstreetmapPlace(@Query() query, @Param('name') name: string): Promise<FeatureCollection> {
        return this.placeFacade.searchOpenstreetmapPlace(name);
    }

    @UseGuards(CompositeAuthGuard)
    @Get()
    getPlaces(@Request() req, @Query() query): Promise<PlaceDto[]> {
        return this.placeFacade.getPlaces(req.user, query);
    }

    @UseGuards(CompositeAuthGuard)
    @Get(':name')
    getPlacesByName(@Request() req, @Query() query, @Param('name') name: string): Promise<PlaceDto[]> {
        return this.placeFacade.getPlacesByName(req.user, query, name);
    }

    @UseGuards(CompositeAuthGuard)
    @Post()
    createPlace(@Request() req, @Body() placeDto: PlaceDto): Promise<PlaceDto> {
        return this.placeFacade.createPlace(req.user, placeDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Put(':id')
    updatePlace(@Request() req, @Param('id') id: number, @Body() placeDto: PlaceDto) {
        return this.placeFacade.updatePlace(req.user, id, placeDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async remove(@Request() req, @Param('id') id: number) {
        await this.placeFacade.removePlace(req.user, id);
    }
}