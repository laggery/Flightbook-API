import {ConflictException, NotFoundException, UnprocessableEntityException} from "@nestjs/common";

export class StudentException {

    public static notFoundException() {
        throw new NotFoundException("Student not found")
    }

    public static alreadyExistsException() {
        throw new ConflictException("The student already exists in school.")
    }
}
