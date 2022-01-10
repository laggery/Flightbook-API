import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SchoolGuard } from 'src/auth/guard/school.guard';
import { FlightDto } from 'src/flight/interface/flight-dto';
import { StudentDto } from 'src/student/interface/student-dto';
import { StudentFacade } from 'src/student/student.facade';
import { SchoolDto } from './interface/school-dto';
import { SchoolFacade } from './school.facade';

@Controller('schools')
export class SchoolController {

    constructor(private schoolFacade: SchoolFacade, private studentFacade: StudentFacade) { } 

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

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/:id/students')
    getStudents(@Request() req, @Param('id') id: number): Promise<StudentDto[]> {
        return this.studentFacade.getStudentsBySchoolId(id);
    }
}
