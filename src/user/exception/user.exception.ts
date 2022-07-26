import {ConflictException, UnprocessableEntityException} from "@nestjs/common";

export class UserException {

    public static invalidEmailException(type?: string) {
        if (!type || type == "") {
            type = "user";
        }
        throw new UnprocessableEntityException(`A ${type} email must be provided and be valid`)
    }
}
