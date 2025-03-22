import { Controller, Get, Headers, HttpCode, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentStatusDto } from './interface/payment-status-dto';
import { PaymentFacade } from './payment-facade';
import { CompositeAuthGuard } from 'src/auth/guard/composite-auth.guard';

@Controller('payments')
@ApiTags('Payments')
@ApiBearerAuth('jwt')
export class PaymentController {

    constructor(
        private paymentFacade: PaymentFacade
    ) {}

    @UseGuards(CompositeAuthGuard)
    @Get('stripe/session/:enrollmentToken')
    stripePaymentInstructor(@Headers('accept-language') acceptLanguage: string, @Headers('origin') origin: string, @Request() req, @Param('enrollmentToken') enrollmentToken: string): Promise<any> {
        const callbackUrl = `${origin}/enrollments/${enrollmentToken}`;
        return this.paymentFacade.getStripeSession(req.user.userId, callbackUrl, acceptLanguage);
    }

    @UseGuards(CompositeAuthGuard)
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

    @UseGuards(CompositeAuthGuard)
    @Get('status')
    async paymentStatus(@Request() req): Promise<PaymentStatusDto> {
        return await this.paymentFacade.hasUserPayed(req.user.userId);
    }

    @UseGuards(CompositeAuthGuard)
    @Post('cancel')
    @HttpCode(204)
    async cancelSubscription(@Request() req) {
        await this.paymentFacade.cancelSubscription(req.user.userId);
    }
}
