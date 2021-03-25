import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SchoolReadDto } from './school/interface/school-read-dto';
import { SchoolWriteDto } from './school/interface/school-write-dto';
import { SchoolFacade } from './school.facade';

@Controller('school')
export class SchoolController {

    constructor(private schoolFacade: SchoolFacade) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createUser(@Request() req, @Body() userWriteDto: SchoolWriteDto): Promise<SchoolReadDto> {
        return this.schoolFacade.createSchool(req.user, userWriteDto);
    }
}
