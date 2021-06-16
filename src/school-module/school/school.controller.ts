import { Body, Controller, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SchoolDto } from './interface/school-dto';
import { SchoolFacade } from './school.facade';

@Controller('school')
export class SchoolController {

    constructor(private schoolFacade: SchoolFacade) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createSchool(@Request() req, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
        return this.schoolFacade.createSchool(req.user, schoolDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateSchool(@Request() req, @Param('id') id: number, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
        return this.schoolFacade.updateSchool(req.user, id, schoolDto);
    }
}
