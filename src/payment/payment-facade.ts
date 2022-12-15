import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PaymentStatusDto } from './interface/payment-status-dto';
import Stripe from 'stripe';
import { UserService } from 'src/user/user.service';
import { env } from 'process';
import { PaymentException } from './exception/payment.exception';

@Injectable()
export class PaymentFacade {
    stripe: any;
    endpointSecret: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly userService: UserService
    ) {
        this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: '2022-11-15',
        });
        this.endpointSecret = env.STRIPE_ENDPOINT_SECRET;
    }

    async getStripeSession(origin: string, userId: number, enrollmentToken: string): Promise<any> {
        const user = await this.userService.getUserById(userId);
        

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: env.STRIPE_PRICE,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${origin}/enrollments/${enrollmentToken}/success`,
            cancel_url: `${origin}/enrollments/${enrollmentToken}/cancel`,
            client_reference_id: userId,
            customer_email: user.email
        });
        return { id: session.id };
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
        console.log(sig)

        let event;

        try {
            event = this.stripe.webhooks.constructEvent(request.body, sig, this.endpointSecret);
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
                break;
        }
    }
}
