import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("theory")
export class Theory {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("boolean", { name: "fluglehre", default: () => "false" })
  fluglehre: boolean;

  @Column("boolean", { name: "wetterkunde", default: () => "false" })
  wetterkunde: boolean;

  @Column("boolean", { name: "flugpraxis", default: () => "false" })
  flugpraxis: boolean;

  @Column("boolean", { name: "gesetzgebung", default: () => "false" })
  gesetzgebung: boolean;

  @Column("boolean", { name: "materialkunde", default: () => "false" })
  materialkunde: boolean;
}
