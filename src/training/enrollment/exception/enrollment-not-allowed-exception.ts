import { MethodNotAllowedException } from "@nestjs/common";

export class EnrollmentNotAllowedException extends MethodNotAllowedException {
    constructor() {
        super("Enrollment not allowed");
      }
}
