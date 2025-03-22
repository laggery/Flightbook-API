import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SchoolDto } from './interface/school-dto';
import { SchoolFacade } from './school.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompositeAuthGuard } from 'src/auth/guard/composite-auth.guard';

@Controller('schools')
@ApiTags('School')
@ApiBearerAuth('jwt')
export class SchoolController {

    constructor(
        private schoolFacade: SchoolFacade
    ) { }

    @UseGuards(CompositeAuthGuard)
    @Post()
    createSchool(@Request() req, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
        return this.schoolFacade.createSchool(req.user, schoolDto);
    }

    // TODO: Need permissions for update school.

    // @UseGuards(CompositeAuthGuard)
    // @Put(':id')
    // updateSchool(@Request() req, @Param('id') id: number, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
    //     return this.schoolFacade.updateSchool(req.user, id, schoolDto);
    // }
}
