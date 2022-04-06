import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("training_hill")
export class TrainingHill {

  @PrimaryGeneratedColumn()
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("boolean", { name: "auslegen", default: () => "false" })
  auslegen: boolean;

  @Column("boolean", { name: "aufziehen", default: () => "false" })
  aufziehen: boolean;

  @Column("boolean", { name: "slalom", default: () => "false" })
  slalom: boolean;

  @Column("boolean", { name: "laufen_angebremst", default: () => "false" })
  laufenAngebremst: boolean;

  @Column("boolean", { name: "vorbereitung", default: () => "false" })
  vorbereitung: boolean;

  @Column("boolean", { name: "startphasen", default: () => "false" })
  startphasen: boolean;

  @Column("boolean", { name: "richtungsaenderungen", default: () => "false" })
  richtungsaenderungen: boolean;

  @Column("boolean", { name: "startabbruch", default: () => "false" })
  startabbruch: boolean;

  @Column("boolean", { name: "seitenwindstart", default: () => "false" })
  seitenwindstart: boolean;

  @Column("boolean", { name: "schlechtAusgelegt", default: () => "false" })
  schlechtAusgelegt: boolean;

  @Column("boolean", { name: "starts", default: () => "false" })
  starts: boolean;

  @Column("boolean", { name: "landungen", default: () => "false" })
  landungen: boolean;

  @Column("boolean", { name: "notlandung", default: () => "false" })
  notlandung: boolean;

  @Column("boolean", { name: "notschirm", default: () => "false" })
  notschirm: boolean;

  @Column("boolean", { name: "kurven", default: () => "false" })
  kurven: boolean;

  @Column("boolean", { name: "entwirren", default: () => "false" })
  entwirren: boolean;

  @Column("boolean", { name: "faltmethoden", default: () => "false" })
  faltmethoden: boolean;

  @Column("boolean", { name: "theorietest", default: () => "false" })
  theorietest: boolean;
}
