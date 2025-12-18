import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {State} from "./state";
import {Subscription} from "../subscription/subscription.entity";
import {School} from "../school/school.entity";
import {User} from "../../user/domain/user.entity";
import { AppointmentType } from "./appointment-type.entity";
import { GuestSubscription } from "../subscription/guest-subscription.entity";

@Entity("appointment")
export class Appointment {
    @PrimaryGeneratedColumn()
    @Column("integer", { primary: true, name: "id" })
    id: number;

    @Column("timestamptz", { name: 'scheduling', nullable: false })
    scheduling: Date;

    @Column("timestamptz", { name: 'deadline', nullable: true })
    deadline: Date;

    @Column("character varying", { name: "meeting_point", nullable: true })
    meetingPoint: string;

    @Column("integer", { name: "max_people", nullable: true })
    maxPeople: number | null;

    @Column("character varying", {
        name: "description",
        nullable: true,
        length: 2000,
    })
    description: string | null;

    @Column("character varying", { name: "state", length: 25, nullable: false })
    state: State;

    @ManyToOne(() => School, (school) => school.appointments, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
    school: School;

    @OneToMany(() => Subscription, (subscription) => subscription.appointment, { cascade: ['insert', 'update'] })
    subscriptions: Subscription[];

    @OneToMany(() => GuestSubscription, (guestSubscription) => guestSubscription.appointment, { cascade: ['insert', 'update', 'remove'] })
    guestSubscriptions: GuestSubscription[];

    @ManyToOne(() => User, (user) => user.instructors, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "instructor_id", referencedColumnName: "id" }])
    instructor: User;

    @ManyToOne(() => User, (user) => user.takeOffCoordinators, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "takeoff_coordinator_id", referencedColumnName: "id" }])
    takeOffCoordinator: User | null;

    @Column("character varying", { name: "takeoff_coordinator", nullable: true })
    takeOffCoordinatorText: string;

    @Column("timestamp", {
        name: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    timestamp: Date;

    @ManyToOne(() => AppointmentType, (appointmentType) => appointmentType.appointments, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "appointment_type_id", referencedColumnName: "id" }])
    type: AppointmentType | null;

    findSubscription(email: string) {
        return this.subscriptions.find((subscription: Subscription) => subscription.user.email === email);
    }

    isUserOnWaintingList(userId: number) {
        const index = this.subscriptions.findIndex((subscription: Subscription) => subscription.user.id === userId);
        if (this.maxPeople && index + 1 > this.maxPeople) {
            return true;
        }
        return false;
    }

    removeUserSubscription(userId: number): Subscription {
        const index = this.subscriptions.findIndex((subscription: Subscription) => subscription.user.id === userId);
        if (index !== -1) {
            const subscription = this.subscriptions[index];
            this.subscriptions.splice(index, 1);
            return subscription;
        }
        return null;
    }

    findGuestSubscription(guestId: number) {
        return this.guestSubscriptions.find((guestSubscription: GuestSubscription) => guestSubscription.id === guestId);
    }

    removeGuestUserSubscription(guestId: number): GuestSubscription {
        const index = this.guestSubscriptions.findIndex((guestSubscription: GuestSubscription) => guestSubscription.id === guestId);
        if (index !== -1) {
            const guestSubscription = this.guestSubscriptions[index];
            this.guestSubscriptions.splice(index, 1);
            return guestSubscription;
        }
        return null;
    }
}
