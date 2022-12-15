import { BadRequestException } from "@nestjs/common";

export class PaymentException {

    public static invalidSignature() {
        throw new BadRequestException("Invalid signature")
    }
}
