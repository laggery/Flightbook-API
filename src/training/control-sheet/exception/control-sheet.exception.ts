import { ForbiddenException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";

export class ControlSheetException {

    public static forbiddenToEdit () {
        throw new ForbiddenException("Forbidden to edit this control sheet");
    }
}
