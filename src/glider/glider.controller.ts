import { Controller, UseGuards, Get, Request, Query, Post, Body, Put, Param, Delete, HttpCode } from '@nestjs/common';
import { GliderFacade } from './glider.facade';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GliderDto } from './interface/glider-dto';
import { PagerDto } from '../interface/pager-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('gliders')
@ApiTags('Glider')
@ApiBearerAuth('jwt')
export class GliderController {

    constructor(private gliderFacade: GliderFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getGliders(@Request() req, @Query() query): Promise<GliderDto[]> {
        return this.gliderFacade.getGliders(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('name/:name')
    getGliderByName(@Request() req, @Param('name') name: string): Promise<GliderDto> {
        return this.gliderFacade.getGliderbyName(req.user, name);
    }

    @UseGuards(JwtAuthGuard)
    @Get('pager')
    getGlidersPager(@Request() req, @Query() query): Promise<PagerDto> {
        return this.gliderFacade.getGlidersPager(req.user, query);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createGlider(@Request() req, @Body() gliderDto: GliderDto): Promise<GliderDto> {
        return this.gliderFacade.createGlider(req.user, gliderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateGlider(@Request() req, @Param('id') id: number, @Body() gliderDto: GliderDto) {
        return this.gliderFacade.updateGlider(req.user, id, gliderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async remove(@Request() req, @Param('id') id: number) {
        await this.gliderFacade.removeGlider(req.user, id);
    }
}
