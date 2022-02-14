import { Controller, Get, HttpCode, Param, Post, Request, UseGuards } from '@nestjs/common';
import { EnrollmentDto } from './interface/enrollment-dto';
import { EnrollmentFacade } from './enrollment.facade';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('enrollments')
@ApiTags('Enrollment')
export class EnrollmentController {

    constructor(
        private enrollmentFacade: EnrollmentFacade
    ) { }

    @Get('/:token')
    getEnrollmentByToken(@Request() req, @Param('token') token: string): Promise<EnrollmentDto> {
        return this.enrollmentFacade.getEnrollmentByToken(token);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/:token')
    @HttpCode(204)
    @ApiBearerAuth('jwt')
    acceptEnrollment(@Request() req, @Param('token') token: string): Promise<boolean> {
        return this.enrollmentFacade.acceptEnrollment(req.user, token);
    }
}
