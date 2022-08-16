import { UnprocessableEntityException } from "@nestjs/common";

export class AppointmentException {

    public static invalidAppointment() {
        throw new UnprocessableEntityException("Invalid appointment: scheduling date, meetingPoint, state and instructor must be provided")
    }
}
