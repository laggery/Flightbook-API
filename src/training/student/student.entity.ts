import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { School } from "../school/school.entity";
import { Note } from "../note/note.entity";

@Entity("student")
export class Student {
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

  @Column("boolean", { name: "isTandem", default: () => "false" })
  isTandem: boolean;

  @OneToMany(() => Note, (note) => note.student)
  notes: Note[];

  getUsedPlaces(): number {
    return this.isTandem ? 2 : 1;
  }
}
