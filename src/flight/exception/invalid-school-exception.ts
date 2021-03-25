import { UnprocessableEntityException } from "@nestjs/common";

export class InvalidSchoolException extends UnprocessableEntityException {
    constructor() {
        super("A school id must be provided and be valid");
      }
}
