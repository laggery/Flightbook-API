import {ConflictException, NotFoundException} from "@nestjs/common";

export class TeamMemberException {

    public static notFoundException() {
        throw new NotFoundException("Team member not found")
    }

    public static alreadyExistsException() {
        throw new ConflictException("The user already exists as team member in school.")
    }
}
