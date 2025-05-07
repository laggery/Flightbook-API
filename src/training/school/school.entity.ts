import { Enrollment } from "../../training/enrollment/enrollment.entity";
import { Student } from "../../training/student/student.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamMember } from "../team-member/team-member.entity";
import {Appointment} from "../appointment/appointment.entity";
import { AppointmentType } from "../appointment/appointment-type.entity";
import { SchoolConfiguration } from "./school-configuration.entity";

@Entity("school")
export class School {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 255, unique: true })
  name: string;

  @Column("character varying", { name: "address1", length: 255 })
  address1: string;

  @Column("character varying", { name: "address2", length: 255, nullable: true })
  address2: string;

  @Column("character varying", { name: "plz", length: 255 })
  plz: string;

  @Column("character varying", { name: "city", length: 255 })
  city: string;

  @Column("character varying", { name: "phone", length: 255 })
  phone: string;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "language", length: 2 })
  language: string;

  @Column(() => SchoolConfiguration, { prefix: false })
  configuration: SchoolConfiguration;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.school, { cascade: ['insert', 'update'] })
  teamMembers: TeamMember[];

  @OneToMany(() => Student, (student) => student.school, { cascade: ['insert', 'update'] })
  students: Student[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.school, { cascade: ['insert', 'update'] })
  enrollments: Enrollment[];

  @OneToMany(() => Appointment, (appointment) => appointment.school, { cascade: ['insert', 'update'] })
  appointments: Appointment[];

  @OneToMany(() => AppointmentType, (appointmentType) => appointmentType.school, { cascade: ['insert', 'update'] })
  appointmentTypes: AppointmentType[];
}
