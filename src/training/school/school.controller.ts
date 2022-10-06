import { Body, Controller, Get, Headers, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SchoolGuard } from 'src/auth/guard/school.guard';
import { EnrollmentDto } from 'src/training/enrollment/interface/enrollment-dto';
import { EnrollmentWriteDto } from 'src/training/enrollment/interface/enrollment-write-dto';
import { EnrollmentFacade } from 'src/training/enrollment/enrollment.facade';
import { StudentDto } from 'src/training/student/interface/student-dto';
import { StudentFacade } from 'src/training/student/student.facade';
import { SchoolDto } from './interface/school-dto';
import { SchoolFacade } from './school.facade';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TeamMemberFacade } from 'src/training/team-member/team-member.facade';
import { UserReadDto } from 'src/user/interface/user-read-dto';

@Controller('schools')
@ApiTags('School')
@ApiBearerAuth('jwt')
export class SchoolController {

    constructor(
        private schoolFacade: SchoolFacade,
        private studentFacade: StudentFacade,
        private teamMembersFacade: TeamMemberFacade,
        private studentEnrollmentFacade: EnrollmentFacade
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

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/:id/students')
    getStudents(@Request() req, @Param('id') id: number): Promise<StudentDto[]> {
        return this.studentFacade.getStudentsBySchoolId(id);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Get('/:id/team-members')
    getTeamMembers(@Request() req, @Param('id') id: number): Promise<UserReadDto[]> {
        return this.teamMembersFacade.getUsersBySchoolId(id);
    }

    @UseGuards(JwtAuthGuard, SchoolGuard)
    @Post('/:id/students/enrollment')
    @HttpCode(204)
    postStudentsEnrollment(@Headers('origin') origin: string, @Param('id') id: number, @Body() studentEnrollmentWriteDto: EnrollmentWriteDto): Promise<EnrollmentDto> {
        return this.studentEnrollmentFacade.createStudentEnrollment(id, studentEnrollmentWriteDto, origin);
    }
}
