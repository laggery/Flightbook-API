import { ApiPropertyOptional } from "@nestjs/swagger";

export class AltitudeFlightDto {
  @ApiPropertyOptional()
  tandem: number;

  @ApiPropertyOptional()
  notlandung: number;

  @ApiPropertyOptional()
  startplatzwahl: number;

  @ApiPropertyOptional()
  aufziehen: number;

  @ApiPropertyOptional()
  kreise: number;

  @ApiPropertyOptional()
  richtungswechsel: number;

  @ApiPropertyOptional()
  acht: number;

  @ApiPropertyOptional()
  engekreise: number;

  @ApiPropertyOptional()
  sackflug: number;

  @ApiPropertyOptional()
  geschwBereich: number;

  @ApiPropertyOptional()
  beschlunigung: number;

  @ApiPropertyOptional()
  negativsteuerung: number;

  @ApiPropertyOptional()
  gewichtsverlagerung: number;

  @ApiPropertyOptional()
  traggurten: number;

  @ApiPropertyOptional()
  pendeln: number;

  @ApiPropertyOptional()
  rollen: number;

  @ApiPropertyOptional()
  klappen: number;

  @ApiPropertyOptional()
  ohren: number;

  @ApiPropertyOptional()
  bStall: number;

  @ApiPropertyOptional()
  spirale: number;

  @ApiPropertyOptional()
  instrumente: number;

  @ApiPropertyOptional()
  soaring: number;

  @ApiPropertyOptional()
  thermik: number;

  @ApiPropertyOptional()
  landevolte: number;

  @ApiPropertyOptional()
  punktlandung: number;

  @ApiPropertyOptional()
  rueckenwindlandung: number;

  @ApiPropertyOptional()
  traggurtenLandung: number;

  @ApiPropertyOptional()
  hanglandung: number;

  @ApiPropertyOptional()
  touchAndGo: number;

  @ApiPropertyOptional()
  examProgramme: number;
}
