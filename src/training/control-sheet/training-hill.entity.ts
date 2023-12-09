import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("training_hill")
export class TrainingHill {

  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("smallint", { name: "auslegen", default: 0 })
  auslegen: number;

  @Column("smallint", { name: "aufziehen", default: 0 })
  aufziehen: number;

  @Column("smallint", { name: "slalom", default: 0 })
  slalom: number;

  @Column("smallint", { name: "laufen_angebremst", default: 0 })
  laufenAngebremst: number;

  @Column("smallint", { name: "vorbereitung", default: 0 })
  vorbereitung: number;

  @Column("smallint", { name: "startphasen", default: 0 })
  startphasen: number;

  @Column("smallint", { name: "richtungsaenderungen", default: 0 })
  richtungsaenderungen: number;

  @Column("smallint", { name: "startabbruch", default: 0 })
  startabbruch: number;

  @Column("smallint", { name: "seitenwindstart", default: 0 })
  seitenwindstart: number;

  @Column("smallint", { name: "schlechtAusgelegt", default: 0 })
  schlechtAusgelegt: number;

  @Column("smallint", { name: "starts", default: 0 })
  starts: number;

  @Column("smallint", { name: "landungen", default: 0 })
  landungen: number;

  @Column("smallint", { name: "notlandung", default: 0 })
  notlandung: number;

  @Column("smallint", { name: "notschirm", default: 0 })
  notschirm: number;

  @Column("smallint", { name: "kurven", default: 0 })
  kurven: number;

  @Column("smallint", { name: "entwirren", default: 0 })
  entwirren: number;

  @Column("smallint", { name: "faltmethoden", default: 0 })
  faltmethoden: number;

  @Column("smallint", { name: "theorietest", default: 0 })
  theorietest: number;
}
