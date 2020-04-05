import { ConflictException, UnprocessableEntityException } from "@nestjs/common";

export class InvalidDateException extends UnprocessableEntityException {
    constructor() {
        super("The flight date must be provided an be a valid Date");
      }
}
