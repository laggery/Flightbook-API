import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("altitude_flight")
export class AltitudeFlight {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("smallint", { name: "tandem", default: 0 })
  tandem: number;

  @Column("smallint", { name: "notlandung", default: 0 })
  notlandung: number;

  @Column("smallint", { name: "startplatzwahl", default: 0 })
  startplatzwahl: number;

  @Column("smallint", { name: "aufziehen", default: 0 })
  aufziehen: number;

  @Column("smallint", { name: "kreise", default: 0 })
  kreise: number;

  @Column("smallint", { name: "richtungswechsel", default: 0 })
  richtungswechsel: number;

  @Column("smallint", { name: "acht", default: 0 })
  acht: number;

  @Column("smallint", { name: "engekreise", default: 0 })
  engekreise: number;

  @Column("smallint", { name: "sackflug", default: 0 })
  sackflug: number;

  @Column("smallint", { name: "geschwBereich", default: 0 })
  geschwBereich: number;

  @Column("smallint", { name: "beschlunigung", default: 0 })
  beschlunigung: number;

  @Column("smallint", { name: "negativsteuerung", default: 0 })
  negativsteuerung: number;

  @Column("smallint", { name: "gewichtsverlagerung", default: 0 })
  gewichtsverlagerung: number;

  @Column("smallint", { name: "traggurten", default: 0 })
  traggurten: number;

  @Column("smallint", { name: "pendeln", default: 0 })
  pendeln: number;

  @Column("smallint", { name: "rollen", default: 0 })
  rollen: number;

  @Column("smallint", { name: "klappen", default: 0 })
  klappen: number;

  @Column("smallint", { name: "ohren", default: 0 })
  ohren: number;

  @Column("smallint", { name: "bStall", default: 0 })
  bStall: number;

  @Column("smallint", { name: "spirale", default: 0 })
  spirale: number;

  @Column("smallint", { name: "instrumente", default: 0 })
  instrumente: number;

  @Column("smallint", { name: "soaring", default: 0 })
  soaring: number;

  @Column("smallint", { name: "thermik", default: 0 })
  thermik: number;

  @Column("smallint", { name: "landevolte", default: 0 })
  landevolte: number;

  @Column("smallint", { name: "punktlandung", default: 0 })
  punktlandung: number;

  @Column("smallint", { name: "rueckenwindlandung", default: 0 })
  rueckenwindlandung: number;

  @Column("smallint", { name: "traggurtenLandung", default: 0 })
  traggurtenLandung: number;

  @Column("smallint", { name: "hanglandung", default: 0 })
  hanglandung: number;

  @Column("smallint", { name: "touchAndGo", default: 0 })
  touchAndGo: number;

  @Column("smallint", { name: "examProgramme", default: 0 })
  examProgramme: number;
}
