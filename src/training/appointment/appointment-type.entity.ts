import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Appointment } from "./appointment.entity";
import { School } from "../school/school.entity";
import { User } from "../../user/user.entity";

@Entity("appointment_type")
export class AppointmentType {
    @PrimaryGeneratedColumn()
    @Column("integer", { primary: true, name: "id" })
    id: number;

    @Column("character varying", { name: "name", nullable: false })
    name: string;

    @Column("boolean", { name: "archived", default: () => "false" })
    archived: boolean;

    @Column("character varying", { name: "meeting_point", nullable: true })
    meetingPoint: string;

    @Column("integer", { name: "max_people", nullable: true })
    maxPeople: number | null;

    @Column("character varying", { name: "color", nullable: true })
    color: string;

    @Column("time", { name: "time", nullable: true })
    time: string;

    @ManyToOne(() => School, (school) => school.appointmentTypes, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
    school: School;

    @OneToMany(() => AppointmentType, (appointment) => appointment.school, { cascade: ['insert', 'update'] })
    appointments: Appointment[];

    @ManyToOne(() => User, (user) => user.instructors, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "instructor_id", referencedColumnName: "id" }])
    instructor: User;
}
