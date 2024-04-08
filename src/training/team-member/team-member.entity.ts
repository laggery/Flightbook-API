import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { School } from "../school/school.entity";

@Entity("team_member")
export class TeamMember {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("boolean", { name: "admin", default: () => "false" })
  admin: boolean;

  @ManyToOne(() => User, (user) => user.teamMembers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => School, (school) => school.teamMembers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: School;
}
