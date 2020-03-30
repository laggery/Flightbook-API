import { ConflictException, UnprocessableEntityException } from "@nestjs/common";

export class InvalidDateException extends UnprocessableEntityException {
    constructor() {
        super("The buyDate is not a valid Date");
      }
}
