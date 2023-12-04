import { NotFoundException, UnprocessableEntityException} from "@nestjs/common";

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
}
