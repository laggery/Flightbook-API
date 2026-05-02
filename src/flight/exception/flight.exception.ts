import { BadRequestException, NotFoundException, UnprocessableEntityException} from "@nestjs/common";

export class FlightException {

    public static notFoundException() {
        throw new NotFoundException("Flight not found");
    }

    public static invalidGliderException() {
        throw new UnprocessableEntityException("A glider id must be provided and be valid");
    }

    public static invalidDateException() {
        throw new UnprocessableEntityException("The flight date must be provided an be a valid Date")
    }

    public static cannotChangePaidFlightException() {
        throw new UnprocessableEntityException("Cannot change flight when payment is already completed");
    }

    public static customValuesWithoutSchoolException() {
        throw new BadRequestException("Cannot set schoolCustomValues without specifying tandemSchool");
    }

    public static invalidCustomFieldKeyException(key: string) {
        throw new BadRequestException(`Custom field key '${key}' is not defined in school configuration`);
    }

    public static requiredCustomFieldMissingException(key: string) {
        throw new BadRequestException(`Required custom field '${key}' is missing`);
    }

    public static invalidCustomFieldTypeException(key: string, expectedType: string, value: any) {
        throw new BadRequestException(`Custom field '${key}' expects type '${expectedType}', got '${typeof value}'`);
    }

    public static invalidDropdownValueException(key: string, value: any, options: string[]) {
        throw new BadRequestException(`Custom field '${key}' value '${value}' is not in allowed options: ${options.join(', ')}`);
    }
}
