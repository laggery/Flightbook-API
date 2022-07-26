import { AppointmentDto } from "./interface/appointment-dto";
import { plainToInstance } from "class-transformer";
import { Appointment } from "./appointment.entity";
import { UserReadDto } from 'src/user/interface/user-read-dto';

export class AppointmentMapper {

    public static toAppointmentDto(appointment: Appointment): AppointmentDto {
        const appointmentDto: AppointmentDto = plainToInstance(AppointmentDto, appointment);
        const instructor = appointment.instructor;
        appointmentDto.instructor = new UserReadDto(instructor.email, instructor.firstname, instructor.lastname);
        const takeOffCoordinator = appointment.takeOffCoordinator;
        if (takeOffCoordinator) {
            appointmentDto.takeOffCoordinator = new UserReadDto(takeOffCoordinator.email, takeOffCoordinator.firstname, takeOffCoordinator.lastname);
        } else {
            delete appointmentDto.takeOffCoordinator;
        }
        return appointmentDto
    }
}
