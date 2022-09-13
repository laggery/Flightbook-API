import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/user.entity";
import {Appointment} from "../appointment/appointment.entity";

@Entity("subscription")
export class Subscription {

    @PrimaryGeneratedColumn()
    @Column("integer", { primary: true, name: "id" })
    id: number;

    @ManyToOne(() => Appointment, (appointment) => appointment.subscriptions, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
    appointment: Appointment;

    @ManyToOne(() => User, (user) => user.subscriptions, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
    user: User;

    @Column("timestamp", {
        name: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    timestamp: Date;
}
