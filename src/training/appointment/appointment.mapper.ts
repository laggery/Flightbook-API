import { AppointmentDto } from "./interface/appointment-dto";
import { plainToInstance } from "class-transformer";
import { Appointment } from "./appointment.entity";
import { UserReadDto } from 'src/user/interface/user-read-dto';
import { Subscription } from "../subscription/subscription.entity";
import { SubscriptionDto } from "../subscription/interface/subscription-dto";
import { AppointmentType } from "./appointment-type.entity";
import { GuestSubscriptionDto } from "../subscription/interface/guest-subscription-dto";
import { GuestSubscription } from "../subscription/guest-subscription.entity";

export class AppointmentMapper {

    public static toAppointmentDtoList(appointments: Appointment[]): AppointmentDto[] {
        const appointmentDtoList = [];
        appointments.forEach((appointment: Appointment) => {
            appointmentDtoList.push(this.toAppointmentDto(appointment));
        })
        return appointmentDtoList
    }

    public static toAppointmentDto(appointment: Appointment): AppointmentDto {
        const {takeOffCoordinator, subscriptions, guestSubscriptions, instructor, type} = appointment;
        const appointmentDto: AppointmentDto = plainToInstance(AppointmentDto, appointment);

        if(instructor) {
            appointmentDto.instructor = new UserReadDto(instructor.email, instructor.firstname, instructor.lastname);
        }
        
        if (takeOffCoordinator) {
            appointmentDto.takeOffCoordinator = new UserReadDto(takeOffCoordinator.email, takeOffCoordinator.firstname, takeOffCoordinator.lastname);
        } else {
            delete appointmentDto.takeOffCoordinator;
        }

        if (type) {
            appointmentDto.type = plainToInstance(AppointmentType, type);
        } else {
            delete appointmentDto.type;
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

        if (guestSubscriptions) {
            const guestSubscriptionDtoList: GuestSubscriptionDto[] = [];
            guestSubscriptions.forEach((guestSubscription: GuestSubscription) => {
                const guestSubscriptionDto = plainToInstance(GuestSubscriptionDto, guestSubscription);
                guestSubscriptionDtoList.push(guestSubscriptionDto);
            })
            appointmentDto.guestSubscriptions = guestSubscriptionDtoList;
        }

        return appointmentDto
    }
}
