import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Student } from "../student/student.entity";

@Entity("note")
export class Note {
  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("timestamptz", { name: 'date', nullable: false })
  date: Date;

  @Column("character varying", { name: "title", length: 150, nullable: true })
  title: string;

  @Column("text", { name: "text", nullable: false })
  text: string;

  @ManyToOne(() => Student, (student) => student.notes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Student;

  @UpdateDateColumn({ 
    type: 'timestamp with time zone',
    name: "timestamp",
    default: () => "CURRENT_TIMESTAMP" 
  })
  timestamp: Date;


}
