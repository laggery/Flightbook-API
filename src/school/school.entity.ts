import { Enrollment } from "src/enrollment/enrollment.entity";
import { Student } from "src/student/student.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamMember } from "../team-member/team-member.entity";

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

  @OneToMany(() => TeamMember, (teamMember) => teamMember.school, { cascade: ['insert', 'update'] })
  teamMembers: TeamMember[];

  @OneToMany(() => Student, (student) => student.school, { cascade: ['insert', 'update'] })
  students: Student[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.school, { cascade: ['insert', 'update'] })
  enrollments: Enrollment[];
}
