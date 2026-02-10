import { User } from "../../user/domain/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { School } from "../school/school.entity";

@Entity("tandem_pilot")
export class TandemPilot {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @ManyToOne(() => User, (user) => user.students, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => School, (school) => school.students, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: School;

  @Column("timestamp with time zone", {
    name: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp: Date;

  @Column("boolean", { name: "isArchived", default: () => "false" })
  isArchived: boolean;
}
