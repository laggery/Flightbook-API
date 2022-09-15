import { NotFoundException } from "@nestjs/common";

export class EnrollmentNotFoundException extends NotFoundException {
    constructor() {
        super("Enrollment not found");
      }
}
