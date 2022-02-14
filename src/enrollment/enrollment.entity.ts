import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { School } from "../school/school.entity";
import { EnrollmentType } from "./enrollment-type";

@Entity("enrollment")
export class Enrollment {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @ManyToOne(() => School, (school) => school.enrollments, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: School;

  @Column("character varying", { name: "token", length: 45 })
  token: string;

  @Column("timestamp with time zone", {
    name: "expire_at",
  })
  expireAt: Date;

  @Column("character varying", { name: "type", length: 25 })
  type: EnrollmentType;
}
