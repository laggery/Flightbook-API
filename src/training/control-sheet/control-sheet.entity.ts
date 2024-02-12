import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AltitudeFlight } from "./altitude-flight.entity";
import { Theory } from "./theory.entity";
import { TrainingHill } from "./training-hill.entity";

@Entity("control_sheet")
export class ControlSheet {

constructor(){
  this.trainingHill = new TrainingHill();
  this.theory = new Theory();
  this.altitudeFlight = new AltitudeFlight();
}

  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @ManyToOne(() => User, (user) => user.students, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @OneToOne(() => TrainingHill, { cascade: ['insert', 'update'] })
  @JoinColumn()
  trainingHill: TrainingHill;

  @OneToOne(() => Theory, { cascade: ['insert', 'update'] })
  @JoinColumn()
  theory: Theory;

  @OneToOne(() => AltitudeFlight, { cascade: ['insert', 'update'] })
  @JoinColumn()
  altitudeFlight: AltitudeFlight;
}
