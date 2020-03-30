import { Controller, UseGuards, Get, Request, Query, Post, Body, Put, Param, Delete, HttpCode } from '@nestjs/common';
import { GliderFacade } from './glider.facade';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GliderDto } from './interface/place-dto';

@Controller('gliders')
export class GliderController {

    constructor(private gliderFacade: GliderFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getPlaces(@Request() req, @Query() query): Promise<GliderDto[]> {
        return this.gliderFacade.getGliders(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createPlace(@Request() req, @Body() gliderDto: GliderDto): Promise<GliderDto> {
        return this.gliderFacade.createPlace(req.user, gliderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updatePlace(@Request() req, @Param('id') id: number, @Body() gliderDto: GliderDto) {
        return this.gliderFacade.updateGlider(req.user, id, gliderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async remove(@Request() req, @Param('id') id: number) {
        await this.gliderFacade.removeGlider(req.user, id);
    }
}
