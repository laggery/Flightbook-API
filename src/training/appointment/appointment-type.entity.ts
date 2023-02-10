import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Appointment } from "./appointment.entity";
import { School } from "../school/school.entity";

@Entity("appointment_type")
export class AppointmentType {
    @PrimaryGeneratedColumn()
    @Column("integer", { primary: true, name: "id" })
    id: number;

    @Column("character varying", { name: "name", nullable: false })
    name: string;

    @Column("boolean", { name: "archived", default: () => "false" })
    archived: boolean;

    @ManyToOne(() => School, (school) => school.appointmentTypes, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
    school: School;

    @OneToMany(() => AppointmentType, (appointment) => appointment.school, { cascade: ['insert', 'update'] })
    appointments: Appointment[];
}
