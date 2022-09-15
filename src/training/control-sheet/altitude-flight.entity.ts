import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("altitude_flight")
export class AltitudeFlight {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("boolean", { name: "tandem", default: () => "false" })
  tandem: boolean;

  @Column("boolean", { name: "notlandung", default: () => "false" })
  notlandung: boolean;

  @Column("boolean", { name: "startplatzwahl", default: () => "false" })
  startplatzwahl: boolean;

  @Column("boolean", { name: "aufziehen", default: () => "false" })
  aufziehen: boolean;

  @Column("boolean", { name: "kreise", default: () => "false" })
  kreise: boolean;

  @Column("boolean", { name: "richtungswechsel", default: () => "false" })
  richtungswechsel: boolean;

  @Column("boolean", { name: "acht", default: () => "false" })
  acht: boolean;

  @Column("boolean", { name: "engekreise", default: () => "false" })
  engekreise: boolean;

  @Column("boolean", { name: "sackflug", default: () => "false" })
  sackflug: boolean;

  @Column("boolean", { name: "geschwBereich", default: () => "false" })
  geschwBereich: boolean;

  @Column("boolean", { name: "beschlunigung", default: () => "false" })
  beschlunigung: boolean;

  @Column("boolean", { name: "negativsteuerung", default: () => "false" })
  negativsteuerung: boolean;

  @Column("boolean", { name: "gewichtsverlagerung", default: () => "false" })
  gewichtsverlagerung: boolean;

  @Column("boolean", { name: "traggurten", default: () => "false" })
  traggurten: boolean;

  @Column("boolean", { name: "pendeln", default: () => "false" })
  pendeln: boolean;

  @Column("boolean", { name: "rollen", default: () => "false" })
  rollen: boolean;

  @Column("boolean", { name: "klappen", default: () => "false" })
  klappen: boolean;

  @Column("boolean", { name: "ohren", default: () => "false" })
  ohren: boolean;

  @Column("boolean", { name: "bStall", default: () => "false" })
  bStall: boolean;

  @Column("boolean", { name: "spirale", default: () => "false" })
  spirale: boolean;

  @Column("boolean", { name: "instrumente", default: () => "false" })
  instrumente: boolean;

  @Column("boolean", { name: "soaring", default: () => "false" })
  soaring: boolean;

  @Column("boolean", { name: "thermik", default: () => "false" })
  thermik: boolean;

  @Column("boolean", { name: "landevolte", default: () => "false" })
  landevolte: boolean;

  @Column("boolean", { name: "punktlandung", default: () => "false" })
  punktlandung: boolean;

  @Column("boolean", { name: "rueckenwindlandung", default: () => "false" })
  rueckenwindlandung: boolean;

  @Column("boolean", { name: "traggurtenLandung", default: () => "false" })
  traggurtenLandung: boolean;

  @Column("boolean", { name: "hanglandung", default: () => "false" })
  hanglandung: boolean;

  @Column("boolean", { name: "touchAndGo", default: () => "false" })
  touchAndGo: boolean;

  @Column("boolean", { name: "examProgramme", default: () => "false" })
  examProgramme: boolean;
}
