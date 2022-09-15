import {ConflictException, UnprocessableEntityException} from "@nestjs/common";

export class SchoolException {

    public static invalidException() {
        throw new UnprocessableEntityException("Invalid school: name, address1, plz, city, phone and email must be provided")
    }

    public static invalidIdException() {
        throw new UnprocessableEntityException("A school id must be provided and be valid")
    }

    public static alreadyExistsException() {
        throw new ConflictException("The school already exists.")
    }
}
