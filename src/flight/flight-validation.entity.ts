import { Column, JoinColumn, ManyToOne } from "typeorm";
import { User } from "../user/domain/user.entity";
import { School } from "../training/school/school.entity";
import { FlightValidationState } from "./flight-validation-state";

/**
 * Flight validation value object
 * Contains information about flight validation by a school
 */
export class FlightValidation {
  @Column("character varying", { name: "validation_state", length: 25, nullable: true })
  state: FlightValidationState | null;

  @Column("text", { name: "validation_comment", nullable: true })
  comment: string | null;
      
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "validation_user_id" })
  instructor: User | null;

  @ManyToOne(() => School, { nullable: true })
  @JoinColumn({ name: "validation_school_id" })
  school: School | null;

  @Column("timestamp with time zone", { name: "validation_timestamp", nullable: true })
  timestamp: Date | null;
}
