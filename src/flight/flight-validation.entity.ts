import { Column, JoinColumn, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";
import { School } from "../training/school/school.entity";

/**
 * Flight validation value object
 * Contains information about flight validation by a school
 */
export class FlightValidation {
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "validation_user_id" })
  instructor: User | null;

  @ManyToOne(() => School, { nullable: true })
  @JoinColumn({ name: "validation_school_id" })
  school: School | null;

  @Column("timestamp with time zone", { name: "validation_timestamp", nullable: true })
  timestamp: Date | null;
}
