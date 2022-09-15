import { ConflictException } from "@nestjs/common";

export class TeamMemberAlreadyExistsException extends ConflictException {
    constructor() {
        super("The user already exists as team member in school.");
      }
}
