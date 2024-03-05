import { Controller, Get, Headers, HttpCode, Param, Post, Request, UseGuards } from '@nestjs/common';
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
    stripePaymentInstructor(@Headers('accept-language') acceptLanguage: string, @Headers('origin') origin: string, @Request() req, @Param('enrollmentToken') enrollmentToken: string): Promise<any> {
        const callbackUrl = `${origin}/enrollments/${enrollmentToken}`;
        return this.paymentFacade.getStripeSession(req.user.userId, callbackUrl, acceptLanguage);
    }

    @UseGuards(JwtAuthGuard)
    @Get('stripe/session')
    stripePaymentWebApp(@Headers('accept-language') acceptLanguage: string, @Headers('origin') origin: string, @Request() req): Promise<any> {
        const callbackUrl = `${origin}/settings`;
        return this.paymentFacade.getStripeSession(req.user.userId, callbackUrl, acceptLanguage);
    }

    @Post('stripe/webhook')
    @HttpCode(204)
    async stripeWebhook(@Request() req) {
        await this.paymentFacade.stripeWebhook(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('status')
    async paymentStatus(@Request() req): Promise<PaymentStatusDto> {
        return await this.paymentFacade.hasUserPayed(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel')
    @HttpCode(204)
    async cancelSubscription(@Request() req) {
        await this.paymentFacade.cancelSubscription(req.user.userId);
    }
}
