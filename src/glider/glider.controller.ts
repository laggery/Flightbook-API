import { Controller, UseGuards, Get, Request, Query, Post, Body, Put, Param, Delete, HttpCode } from '@nestjs/common';
import { GliderFacade } from './glider.facade';
import { CompositeAuthGuard } from '../auth/guard/composite-auth.guard';
import { GliderDto } from './interface/glider-dto';
import { PagerDto } from '../interface/pager-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('gliders')
@ApiTags('Glider')
@ApiBearerAuth('jwt')
export class GliderController {

    constructor(private gliderFacade: GliderFacade) { }

    @UseGuards(CompositeAuthGuard)
    @Get()
    getGliders(@Request() req, @Query() query): Promise<GliderDto[]> {
        return this.gliderFacade.getGliders(req.user, query);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('name/:name')
    getGliderByName(@Request() req, @Param('name') name: string): Promise<GliderDto> {
        return this.gliderFacade.getGliderbyName(req.user, name);
    }

    @UseGuards(CompositeAuthGuard)
    @Get('pager')
    getGlidersPager(@Request() req, @Query() query): Promise<PagerDto> {
        return this.gliderFacade.getGlidersPager(req.user, query);
    }

    @UseGuards(CompositeAuthGuard)
    @Post()
    createGlider(@Request() req, @Body() gliderDto: GliderDto): Promise<GliderDto> {
        return this.gliderFacade.createGlider(req.user, gliderDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Put(':id')
    updateGlider(@Request() req, @Param('id') id: number, @Body() gliderDto: GliderDto) {
        return this.gliderFacade.updateGlider(req.user, id, gliderDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async remove(@Request() req, @Param('id') id: number) {
        await this.gliderFacade.removeGlider(req.user, id);
    }
}
