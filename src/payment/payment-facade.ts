import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PaymentStatusDto } from './interface/payment-status-dto';
import Stripe from 'stripe';
import { UserService } from 'src/user/user.service';
import { env } from 'process';
import { PaymentException } from './exception/payment.exception';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PaymentFacade {
    stripe: Stripe;
    endpointSecret: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly userService: UserService,
        private readonly emailService: EmailService
    ) {
        this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: '2022-11-15',
        });
        this.endpointSecret = env.STRIPE_ENDPOINT_SECRET;
    }

    async getStripeSession(origin: string, userId: number, enrollmentToken: string, lang: string): Promise<any> {
        const user = await this.userService.getUserById(userId);

        const session = await this.stripe.checkout.sessions.create({
            locale: lang as Stripe.Checkout.SessionCreateParams.Locale,
            payment_method_types: ['card'],
            line_items: [{
                price: env.STRIPE_PRICE,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${origin}/enrollments/${enrollmentToken}/success`,
            cancel_url: `${origin}/enrollments/${enrollmentToken}/cancel`,
            client_reference_id: userId.toString(),
            customer_email: user.email
        });
        return { id: session.id, url: session.url };
    }

    async hasUserPayed(id: number): Promise<PaymentStatusDto> {
        const response = await firstValueFrom(this.httpService.get(
            `${env.REVENUECAT_URL}/v1/subscribers/${id}`,
            {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${env.REVENUECAT_AUTH}`
                }
            }
        ));

        const productSubscription = response.data.subscriber.entitlements[env.REVENUECAT_ENTITLEMENT];

        let paymentStatusDto = new PaymentStatusDto();
        paymentStatusDto.store = response.data.subscriber.subscriptions[productSubscription?.product_identifier]?.store;

        if (productSubscription && new Date <= new Date(productSubscription.expires_date)) {
            paymentStatusDto.expires_date = productSubscription.expires_date;
            paymentStatusDto.purchase_date = productSubscription.purchase_date;
            paymentStatusDto.active = true;
        } else {
            paymentStatusDto.active = false;
        }
        return paymentStatusDto;
    }

    async stripeWebhook(request: any) {
        const sig = request.headers['stripe-signature'];

        let event;

        try {
            event = this.stripe.webhooks.constructEvent(request.rawBody, sig, this.endpointSecret);
        } catch (err) {
            PaymentException.invalidSignature();
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const revenuecatData = {
                    app_user_id: `${session.client_reference_id}`,
                    fetch_token: session.subscription
                }
                try {
                    await firstValueFrom(this.httpService.post(
                        `${env.REVENUECAT_URL}/v1/receipts`,
                        revenuecatData,
                        {
                            headers: {
                                'Content-Type': "application/json",
                                'X-Platform': 'stripe',
                                'Authorization': `Bearer ${env.REVENUECAT_AUTH}`
                            }
                        }
                    ));
                } catch (exception) {
                    this.emailService.sendErrorMessageToAdmin("Revenuecat request failed", `<ul><li>app_user_id: ${session.client_reference_id}</li>li>fetch_token: ${session.subscription}</li></ul>`)
                }
                
                break;
        }
    }
}
