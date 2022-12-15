import { Body, Controller, Get, Headers, HttpCode, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PaymentStatusDto } from './interface/payment-status-dto';
import { PaymentFacade } from './payment-facade';

@Controller('payments')
@ApiTags('Payments')
@ApiBearerAuth('jwt')
export class PaymentController {

    constructor(
        private paymentFacade: PaymentFacade
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('stripe/session/:enrollmentToken')
    stripePayment(@Headers('origin') origin: string, @Request() req, @Param('enrollmentToken') enrollmentToken: string): Promise<any> {
        return this.paymentFacade.getStripeSession(origin, req.user.userId, enrollmentToken);
    }

    @Post('stripe/webhook')
    @HttpCode(204)
    async hasUserPayed(@Request() req) {
        await this.paymentFacade.stripeWebhook(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('status')
    async paymentStatus(@Request() req): Promise<PaymentStatusDto> {
        return await this.paymentFacade.hasUserPayed(req.user.userId);
    }
}
