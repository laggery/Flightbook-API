import { UnprocessableEntityException } from "@nestjs/common";

export class S3Exception extends UnprocessableEntityException {
    constructor() {
        super("S3 error");
      }
}
