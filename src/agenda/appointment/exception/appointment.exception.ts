import { UnprocessableEntityException } from "@nestjs/common";

export class AppointmentException {

    public static invalidAppointment() {
        throw new UnprocessableEntityException("Invalid appointment: scheduling date, meetingPoint, state, school and instructor must be provided")
    }
}
