import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("theory")
export class Theory {

  constructor(){
    this.fluglehre = 0;
    this.wetterkunde = 0;
    this.flugpraxis = 0;
    this.gesetzgebung = 0;
    this.materialkunde = 0;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column("smallint", { name: "fluglehre", default: 0 })
  fluglehre: number;

  @Column("smallint", { name: "wetterkunde", default: 0 })
  wetterkunde: number;

  @Column("smallint", { name: "flugpraxis", default: 0 })
  flugpraxis: number;

  @Column("smallint", { name: "gesetzgebung", default: 0 })
  gesetzgebung: number;

  @Column("smallint", { name: "materialkunde", default: 0 })
  materialkunde: number;
}
