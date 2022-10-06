import { ConflictException } from "@nestjs/common";

export class StudentAlreadyExistsException extends ConflictException {
    constructor() {
        super("The student already exists in school.");
      }
}
