import { ConflictException } from "@nestjs/common";

export class PlaceAlreadyExistsException extends ConflictException {
    constructor() {
        super("The place already exists.");
      }
}
