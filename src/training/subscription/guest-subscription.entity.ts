import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "../appointment/appointment.entity";

@Entity("guest_subscription")
export class GuestSubscription {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "firstname", length: 30 })
  firstname: string;

  @Column("character varying", { name: "lastname", length: 30 })
  lastname: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.subscriptions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
  appointment: Appointment;
}
