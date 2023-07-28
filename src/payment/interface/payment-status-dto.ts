import { PaymentState } from "../paymentState";

export class PaymentStatusDto {
    active: boolean
    state: PaymentState
    expires_date: Date;
    purchase_date: Date;
    store: string;
}
