import { UnprocessableEntityException } from "@nestjs/common";

export class InvalidUserException extends UnprocessableEntityException {
    constructor() {
        super("Invalid user: email, firstname, lastname, password must be provided");
      }
}
