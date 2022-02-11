import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { StudentGuard } from 'src/auth/guard/student.guard';
import { FlightDto } from 'src/flight/interface/flight-dto';
import { StudentFacade } from './student.facade';

@Controller('students')
@ApiTags('Student')
@ApiBearerAuth('jwt')
export class StudentController {

    constructor(private studentFacade: StudentFacade){}

    @UseGuards(JwtAuthGuard, StudentGuard)
    @Get('/:id/flights')
    getStudentDetail(@Request() req, @Param('id') id: number): Promise<FlightDto[]> {
        return this.studentFacade.getStudentFlightsByStudentId(id);
    }
}
