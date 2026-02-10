import { Column, JoinColumn, ManyToOne } from "typeorm";
import { User } from "../user/domain/user.entity";
import { School } from "../training/school/school.entity";
import { TandemSchoolPaymentState } from "./tandem-school-payment-state";

/**
 * Tandem school data value object
 * Contains information about tandem school
 */
export class TandemSchoolData {
  @Column("character varying", { name: "tandem_school_payment_state", length: 25, nullable: true })
  paymentState: TandemSchoolPaymentState | null;

  @Column("text", { name: "tandem_school_payment_comment", nullable: true })
  paymentComment: string | null;
      
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "tandem_school_payment_user_id" })
  instructor: User | null;

  @ManyToOne(() => School, { nullable: true })
  @JoinColumn({ name: "tandem_school_id" })
  tandemSchool: School | null;

  @Column("timestamp with time zone", { name: "tandem_school_payment_timestamp", nullable: true })
  paymentTimestamp: Date | null;
}
