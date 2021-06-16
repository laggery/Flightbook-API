import { Flight } from "src/flight/flight.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { School } from "../school/school.entity";

@Entity("validation")
export class Validation {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("character varying", { name: "state", length: 20 })
  state: ValidationState;

  @Column("date", { name: "date", nullable: true })
  date: Date | null;

  @OneToOne(() => Flight)
  flight: Flight;

  @ManyToOne(() => User, (user) => user.validations, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "teacher_id", referencedColumnName: "id" }])
  teacher: User;

  @ManyToOne(() => School, (school) => school.validations, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
    nullable: false
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school!: School;
}
