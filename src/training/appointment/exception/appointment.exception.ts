import { BadRequestException, UnprocessableEntityException } from "@nestjs/common";

export class AppointmentException {

    public static invalidAppointment() {
        throw new UnprocessableEntityException("Invalid appointment: scheduling date and state must be provided")
    }

    public static invalidAppointmentType() {
        throw new UnprocessableEntityException("Invalid appointment type: name and archived must be provided")
    }

    public static invalidAppointmentTypeId() {
        throw new UnprocessableEntityException("An appointment type id must be provided and be valid")
    }

    public static invalidUnsubscribe() {
        throw new BadRequestException("Invalid unsubscribe: user must be subscribed to the appointment")
    }
}
