import { UnprocessableEntityException } from "@nestjs/common";

export class InvalidSchoolException extends UnprocessableEntityException {
    constructor() {
        super("Invalid school: name, address1, plz, city, phone and email must be provided");
      }
}
