import { ConflictException } from "@nestjs/common";

export class SchoolAlreadyExistsException extends ConflictException {
    constructor() {
        super("The school already exists.");
      }
}
