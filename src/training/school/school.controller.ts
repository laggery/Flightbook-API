import { Body, Controller, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { SchoolDto } from './interface/school-dto';
import { SchoolFacade } from './school.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompositeAuthGuard } from '../../auth/guard/composite-auth.guard';
import { SchoolConfigurationDto } from './interface/school-configuration-dto';
import { SchoolGuard } from 'src/auth/guard/school.guard';

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

    @UseGuards(CompositeAuthGuard, SchoolGuard)
    @Put(':id/configuration')
    updateSchoolConfiguration(@Param('id') id: number, @Body() schoolConfigurationDto: SchoolConfigurationDto): Promise<SchoolDto> {
        return this.schoolFacade.updateSchoolConfiguration(id, schoolConfigurationDto);
    }

    // TODO: Need permissions for update school.

    // @UseGuards(CompositeAuthGuard)
    // @Put(':id')
    // updateSchool(@Request() req, @Param('id') id: number, @Body() schoolDto: SchoolDto): Promise<SchoolDto> {
    //     return this.schoolFacade.updateSchool(req.user, id, schoolDto);
    // }
}
