import { Controller, Get, HttpCode, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnrollmentFacade } from '../../training/enrollment/enrollment.facade';
import { EnrollmentDto } from '../../training/enrollment/interface/enrollment-dto';

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
