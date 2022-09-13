import { ConflictException } from "@nestjs/common";

export class SubscriptionException {

    public static alreadyExistsException() {
        throw new ConflictException("The is user already subscribed.");
    }
}
