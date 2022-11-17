import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SchoolDto } from './interface/school-dto';
import { SchoolFacade } from './school.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('schools')
@ApiTags('School')
@ApiBearerAuth('jwt')
export class SchoolController {

    constructor(
        private schoolFacade: SchoolFacade
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createSchool(@Request() req, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
        return this.schoolFacade.createSchool(req.user, schoolDto);
    }

    // TODO: Need permissions for update school.

    // @UseGuards(JwtAuthGuard)
    // @Put(':id')
    // updateSchool(@Request() req, @Param('id') id: number, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
    //     return this.schoolFacade.updateSchool(req.user, id, schoolDto);
    // }
}
