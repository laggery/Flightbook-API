import { UnprocessableEntityException } from "@nestjs/common";

export class InvalidPasswordException extends UnprocessableEntityException {
    constructor() {
        super("Invalid password: old password and new password must be provided");
      }
}
