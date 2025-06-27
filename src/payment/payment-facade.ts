import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PaymentStatusDto } from './interface/payment-status-dto';
import Stripe from 'stripe';
import { UserRepository } from '../user/user.repository';
import { env } from 'process';
import { PaymentException } from './exception/payment.exception';
import { EmailService } from '../email/email.service';
import { PaymentState } from './paymentState';
import { User } from '../user/user.entity';

@Injectable()
export class PaymentFacade {
    stripe: Stripe;
    endpointSecret: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService
    ) {
        this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: '2022-11-15',
        });
        this.endpointSecret = env.STRIPE_ENDPOINT_SECRET;
    }

    async getStripeSession(userId: number, callbackUrl: string, lang: string): Promise<any> {
        const user = await this.userRepository.getUserById(userId);

        // Map your application's language code to a valid Stripe locale
        const validLocales = [
            'de', 'en', 'fr', 'it'
        ];
        
        // Default to 'en' if the provided language isn't supported by Stripe
        let stripeLocale = 'en';
        
        // If the provided lang is valid for Stripe, use it
        if (validLocales.includes(lang)) {
            stripeLocale = lang;
        }

        const session = await this.stripe.checkout.sessions.create({
            locale: stripeLocale as Stripe.Checkout.SessionCreateParams.Locale,
            payment_method_types: ['card'],
            line_items: [{
                price: env.STRIPE_PRICE,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${callbackUrl}/success`,
            cancel_url: `${callbackUrl}/cancel`,
            client_reference_id: userId.toString(),
            customer_email: user.email,
            allow_promotion_codes: true
        });
        return { id: session.id, url: session.url };
    }

    async cancelSubscription(id: number) {
        // TODO Check store (Stripe, IOs, Android) -> not yet necessary
        
        const user = await this.userRepository.getUserById(id);
        if (!user.email || user.email == null || user.email == undefined || user.email == '') {
            return;
        }

        const stripeCustomerList = await this.stripe.customers.list({email: user.email});

        if (stripeCustomerList.data.length <= 0) {
            Logger.error(`Cancel payment subscription error for user id ${user.id} email: ${user.email} firstname: ${user.firstname} lastname: ${user.lastname}`)
            this.emailService.sendErrorMessageToAdmin("Error: Cancel payment subscription", `<p>Manually cancel Stripe subscription for the following user:</p><ul><li>id: ${user.id}</li><li>email: ${user.email}</li><li>firstname: ${user.firstname}</li><li>lastname: ${user.lastname}</li></ul>`)
            return
        }

        const stripeCustomer = stripeCustomerList.data[0];
        const stripeSubscriptionList = await this.stripe.subscriptions.list({customer: stripeCustomer.id});

        if (stripeSubscriptionList.data.length <= 0) {
            return
        }

        const stripeSubscription = stripeSubscriptionList.data[0];

        this.emailService.sendErrorMessageToAdmin("Cancel payment subscription", `<ul><li>id: ${user.id}</li><li>email: ${user.email}</li><li>firstname: ${user.firstname}</li><li>lastname: ${user.lastname}</li><li>Stripe customer id: ${stripeCustomer.id}</li><li>Stripe subscription id: ${stripeSubscription.id}</li></ul>`)

        await this.stripe.subscriptions.cancel(stripeSubscription.id);
    }

    async hasUserPayed(id: number): Promise<PaymentStatusDto> {
        let paymentStatusDto = new PaymentStatusDto();
        paymentStatusDto.active = false;
        paymentStatusDto.state = PaymentState.NONE;

        const user = await this.userRepository.getUserById(id);
        if (user.paymentExempted) {
            paymentStatusDto.active = true;
            paymentStatusDto.state = PaymentState.EXEMPTED;
        }

        try {
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
    
            paymentStatusDto.store = response.data.subscriber.subscriptions[productSubscription?.product_identifier]?.store;
    
            if (productSubscription && new Date <= new Date(productSubscription.expires_date)) {
                paymentStatusDto.expires_date = productSubscription.expires_date;
                paymentStatusDto.purchase_date = productSubscription.purchase_date;
                paymentStatusDto.active = true;
                paymentStatusDto.state = PaymentState.ACTIVE;
    
                if (productSubscription.unsubscribe_detected_at != undefined) {
                    paymentStatusDto.state = PaymentState.CANCELED;
                }
            } else if(!user.paymentExempted && productSubscription && new Date > new Date(productSubscription.expires_date)) {
                paymentStatusDto.expires_date = productSubscription.expires_date;
                paymentStatusDto.purchase_date = productSubscription.purchase_date;
                paymentStatusDto.active = false;
                paymentStatusDto.state = PaymentState.EXPIRED;
            }
        } catch (e: any) {
            paymentStatusDto.active = true;
            paymentStatusDto.state = PaymentState.NONE;
            Logger.error(`Error check payment status for user id ${id}`);
            //this.emailService.sendErrorMessageToAdmin('Error check payment status', `Error check payment status for user id ${id}`);
        }

        return paymentStatusDto;
        
    }

    async updatePaymentUser(user: User, oldEmail: string) {
        try {
            // TODO Check store (Stripe, IOs, Android) -> not yet necessary
            const customers = await this.stripe.customers.list({
                email: oldEmail,
            });

            customers.data.forEach((customer: Stripe.Customer) => {
                this.stripe.customers.update(
                    customer.id,
                    {email: user.email}
                );
            });
        } catch (e: any) {
            Logger.error(`Error update payment email for user id ${user.id} with old email ${oldEmail} and new email ${user.email}`);
            this.emailService.sendErrorMessageToAdmin('Error update payment email', `Error update payment email for user id ${user.id} with old email ${oldEmail} and new email ${user.email}`);
        }
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
                try {
                    const user = await this.userRepository.getUserById(session.client_reference_id);
                    const revenuecatData = {
                        app_user_id: `${session.client_reference_id}`,
                        fetch_token: session.subscription,
                        attributes: {
                            $email: {
                                value: user.email
                            },
                            $displayName: {
                                value: `${user.firstname} ${user.lastname}`
                            }
                        }
                    }

                    await firstValueFrom(this.httpService.post(
                        `${env.REVENUECAT_URL}/v1/receipts`,
                        revenuecatData,
                        {
                            headers: {
                                'Content-Type': "application/json",
                                'X-Platform': 'stripe',
                                'Authorization': `Bearer ${env.REVENUECAT_STRIPE_PUBLIC_KEY}`
                            }
                        }
                    ));
                } catch (exception) {
                    this.emailService.sendErrorMessageToAdmin("Revenuecat request failed", `<ul><li>app_user_id: ${session.client_reference_id}</li><li>fetch_token: ${session.subscription}</li></ul>`)
                }

                break;

            case 'invoice.upcoming':
                const invoiceUpcoming = event.data.object;
                const email = invoiceUpcoming.customer_email;
                const user = await this.userRepository.getUserByEmail(email);
                if (user) {
                    this.emailService.sendInvoiceUpcoming(user);
                }
                break;
        }
    }
}
