import { Controller, Get, HttpCode, Param, Post, Request, UseGuards } from '@nestjs/common';
import { EnrollmentDto } from './interface/enrollment-dto';
import { EnrollmentFacade } from './enrollment.facade';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('enrollments')
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
    acceptEnrollment(@Request() req, @Param('token') token: string): Promise<boolean> {
        return this.enrollmentFacade.acceptEnrollment(req.user, token);
    }
}
