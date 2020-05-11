import { ForbiddenException } from "@nestjs/common";

export class InvalidOldPasswordException extends ForbiddenException {
    constructor() {
        super("Invalid password: old password is wrong");
      }
}
