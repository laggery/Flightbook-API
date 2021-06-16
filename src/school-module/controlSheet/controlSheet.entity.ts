import { User } from "src/user/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { School } from "../school/school.entity";

@Entity("control_sheet")
export class ControlSheet {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("character varying", { name: "version", length: 20})
  version: string;

  @Column("jsonb", { name: "content" })
  content: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => School, (school) => school.controlSheets, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "school_id", referencedColumnName: "id" }])
  school: School;
}
