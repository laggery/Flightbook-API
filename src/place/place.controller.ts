import { Controller, Get, Post, Body, HttpCode, Put, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PlaceDto } from './interface/place-dto';
import { PlaceFacade } from './place.facade';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PagerDto } from 'src/interface/pager-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('places')
@ApiTags('Place')
@ApiBearerAuth('jwt')
export class PlaceController {

    constructor(
        private placeFacade: PlaceFacade,
        private readonly httpService: HttpService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get("elevation")
    async getElevationByCoordinates(@Request() req, @Query() query) {
        try {
            const resp = await firstValueFrom(this.httpService.get(`https://api.opentopodata.org/v1/srtm30m?locations=${query.lat},${query.lng}`));
            return resp.data.results[0];
        } catch (exceptiom) {
            return null;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getPlaces(@Request() req, @Query() query): Promise<PlaceDto[]> {
        return this.placeFacade.getPlaces(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('pager')
    getPlacesPager(@Request() req, @Query() query): Promise<PagerDto> {
        return this.placeFacade.getPlacesPager(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':name')
    getPlacesByName(@Request() req, @Query() query, @Param('name') name: string): Promise<PlaceDto[]> {
        return this.placeFacade.getPlacesByName(req.user, query, name);
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