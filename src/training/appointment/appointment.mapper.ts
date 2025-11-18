import { AppointmentDto } from "./interface/appointment-dto";
import { plainToInstance } from "class-transformer";
import { Appointment } from "./appointment.entity";
import { UserReadDto } from '../../user/interface/user-read-dto';
import { Subscription } from "../subscription/subscription.entity";
import { SubscriptionDto } from "../subscription/interface/subscription-dto";
import { GuestSubscriptionDto } from "../subscription/interface/guest-subscription-dto";
import { GuestSubscription } from "../subscription/guest-subscription.entity";
import { AppointmentTypeDto } from "./interface/appointment-type-dto";
import { FlightDto } from "../../flight/interface/flight-dto";

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
            appointmentDto.instructor = new UserReadDto(instructor.email, instructor.firstname, instructor.lastname, instructor.phone);
        }
        
        if (takeOffCoordinator) {
            appointmentDto.takeOffCoordinator = new UserReadDto(takeOffCoordinator.email, takeOffCoordinator.firstname, takeOffCoordinator.lastname, takeOffCoordinator.phone);
        } else {
            delete appointmentDto.takeOffCoordinator;
        }

        if (type) {
            appointmentDto.type = plainToInstance(AppointmentTypeDto, type);
        } else {
            delete appointmentDto.type;
        }

        if (subscriptions) {
            const subscriptionDtoList: SubscriptionDto[] = [];
            subscriptions.forEach((subscription: Subscription) => {
                const subscriptionDto = plainToInstance(SubscriptionDto, subscription);
                subscriptionDto.user =  new UserReadDto(subscription.user.email, subscription.user.firstname, subscription.user.lastname, subscription.user.phone, plainToInstance(FlightDto, subscription.user.flights));

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
