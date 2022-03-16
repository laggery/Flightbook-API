import { Student } from "src/student/student.entity";
import { TeamMember } from "src/team-member/team-member.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flight } from "../flight/flight.entity";
import { Glider } from "../glider/glider.entity";
import { Place } from "../place/place.entity";

@Index("idx_16606_idx_e12875dfb3b1d92d7d7c5377e2", ["email"], { unique: true })
@Index("idx_16409_idx_e12875dfb3b1d92d7d7c5377e2", ["email"], { unique: true })
@Index("idx_16409_email", ["email"], { unique: true })
@Index("idx_16606_email", ["email"], { unique: true })
@Index("idx_16606_primary", ["id"], { unique: true })
@Index("idx_16409_primary", ["id"], { unique: true })
@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "salt", nullable: true, length: 255 })
  salt: string | null;

  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("timestamp with time zone", { name: "last_login", nullable: true })
  lastLogin: Date | null;

  @Column("character varying", {
    name: "confirmation_token",
    nullable: true,
    length: 255,
  })
  confirmationToken: string | null;

  @Column("timestamp with time zone", {
    name: "password_requested_at",
    nullable: true,
  })
  passwordRequestedAt: Date | null;

  @Column("character varying", { name: "firstname", length: 30 })
  firstname: string;

  @Column("character varying", { name: "lastname", length: 30 })
  lastname: string;

  @Column("character varying", { name: "token", nullable: true, length: 60 })
  token: string | null;

  @OneToMany(() => Flight, (flight) => flight.user)
  flights: Flight[];

  @OneToMany(() => Glider, (glider) => glider.user)
  gliders: Glider[];

  @OneToMany(() => Place, (place) => place.user)
  places: Place[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.user)
  teamMembers: TeamMember[];

  @OneToMany(() => Student, (student) => student.user)
  students: Student[];
}
