import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("level")
export class Level {

  constructor(){
    this.start = 0;
    this.maneuver = 0;
    this.landing = 0;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column("smallint", { name: "start", default: 0 })
  start: number;

  @Column("smallint", { name: "maneuver", default: 0 })
  maneuver: number;

  @Column("smallint", { name: "landing", default: 0 })
  landing: number;
}
