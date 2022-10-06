import { AppointmentDto } from "./interface/appointment-dto";
import { plainToInstance } from "class-transformer";
import { Appointment } from "./appointment.entity";
import { UserReadDto } from 'src/user/interface/user-read-dto';
import { Subscription } from "../subscription/subscription.entity";
import { SubscriptionDto } from "../subscription/interface/subscription-dto";

export class AppointmentMapper {

    public static toAppointmentDtoList(appointments: Appointment[]): AppointmentDto[] {
        const appointmentDtoList = [];
        appointments.forEach((appointment: Appointment) => {
            appointmentDtoList.push(this.toAppointmentDto(appointment));
        })
        return appointmentDtoList
    }

    public static toAppointmentDto(appointment: Appointment): AppointmentDto {
        const {takeOffCoordinator, subscriptions, instructor} = appointment;
        const appointmentDto: AppointmentDto = plainToInstance(AppointmentDto, appointment);

        if(instructor) {
            appointmentDto.instructor = new UserReadDto(instructor.email, instructor.firstname, instructor.lastname);
        }
        
        if (takeOffCoordinator) {
            appointmentDto.takeOffCoordinator = new UserReadDto(takeOffCoordinator.email, takeOffCoordinator.firstname, takeOffCoordinator.lastname);
        } else {
            delete appointmentDto.takeOffCoordinator;
        }

        if (subscriptions) {
            const subscriptionDtoList: SubscriptionDto[] = [];
            subscriptions.forEach((subscription: Subscription) => {
                const subscriptionDto = plainToInstance(SubscriptionDto, subscription);
                subscriptionDto.user =  new UserReadDto(subscription.user.email, subscription.user.firstname, subscription.user.lastname);

                subscriptionDtoList.push(subscriptionDto);
            })
            appointmentDto.subscriptions = subscriptionDtoList;
        }

        return appointmentDto
    }
}
