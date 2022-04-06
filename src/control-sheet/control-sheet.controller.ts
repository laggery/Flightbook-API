import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ControlSheetFacade } from './control-sheet.facade';
import { ControlSheetDto } from './interface/control-sheet-dto';

@Controller('control-sheet')
@ApiTags('Control sheet')
@ApiBearerAuth('jwt')
export class ControlSheetController {

    constructor(private readonly controlSheetFacade: ControlSheetFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getControlSheet(@Request() req): Promise<ControlSheetDto> {
        return this.controlSheetFacade.getControlSheet(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createUpdateControlSheet(@Request() req, @Body() controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        return this.controlSheetFacade.createUpdateControlSheet(req.user, controlSheetDto);
    }
}
