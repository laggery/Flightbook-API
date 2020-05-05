import { UnprocessableEntityException } from "@nestjs/common";

export class InvalidGliderException extends UnprocessableEntityException {
    constructor() {
        super("A glider id must be provided and be valid");
      }
}
