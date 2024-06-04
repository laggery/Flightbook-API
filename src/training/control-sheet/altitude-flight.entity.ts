import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("altitude_flight")
export class AltitudeFlight {

  constructor(){
    this.tandem = 0;
    this.notlandung = 0;
    this.startplatzwahl = 0;
    this.aufziehen = 0;
    this.kreise = 0;
    this.richtungswechsel = 0;
    this.acht = 0;
    this.engekreise = 0;
    this.sackflug = 0;
    this.geschwBereich = 0;
    this.beschlunigung = 0;
    this.negativsteuerung = 0;
    this.gewichtsverlagerung = 0;
    this.traggurten = 0;
    this.pendeln = 0;
    this.rollen = 0;
    this.klappen = 0;
    this.ohren = 0;
    this.bStall = 0;
    this.spirale = 0;
    this.instrumente = 0;
    this.soaring = 0;
    this.thermik = 0;
    this.landevolte = 0;
    this.punktlandung = 0;
    this.rueckenwindlandung = 0;
    this.traggurtenLandung = 0;
    this.hanglandung = 0;
    this.touchAndGo = 0;
    this.examProgramme = 0;
  }

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
