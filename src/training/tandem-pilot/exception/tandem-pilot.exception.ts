import {ConflictException, NotFoundException} from "@nestjs/common";

export class TandemPilotException {

    public static notFoundException() {
        throw new NotFoundException("Tandem pilot not found")
    }

    public static alreadyExistsException() {
        throw new ConflictException("The tandem pilot already exists in school.")
    }
}
