import { ConflictException, UnprocessableEntityException } from "@nestjs/common";

export class WrongDateFormatException extends UnprocessableEntityException {
    constructor() {
        super("The buyDate format must be yyyy-mm-dd");
      }
}
