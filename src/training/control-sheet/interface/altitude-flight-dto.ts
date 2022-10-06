import { ApiPropertyOptional } from "@nestjs/swagger";

export class AltitudeFlightDto {
  @ApiPropertyOptional()
  tandem: boolean;

  @ApiPropertyOptional()
  notlandung: boolean;

  @ApiPropertyOptional()
  startplatzwahl: boolean;

  @ApiPropertyOptional()
  aufziehen: boolean;

  @ApiPropertyOptional()
  kreise: boolean;

  @ApiPropertyOptional()
  richtungswechsel: boolean;

  @ApiPropertyOptional()
  acht: boolean;

  @ApiPropertyOptional()
  engekreise: boolean;

  @ApiPropertyOptional()
  sackflug: boolean;

  @ApiPropertyOptional()
  geschwBereich: boolean;

  @ApiPropertyOptional()
  beschlunigung: boolean;

  @ApiPropertyOptional()
  negativsteuerung: boolean;

  @ApiPropertyOptional()
  gewichtsverlagerung: boolean;

  @ApiPropertyOptional()
  traggurten: boolean;

  @ApiPropertyOptional()
  pendeln: boolean;

  @ApiPropertyOptional()
  rollen: boolean;

  @ApiPropertyOptional()
  klappen: boolean;

  @ApiPropertyOptional()
  ohren: boolean;

  @ApiPropertyOptional()
  bStall: boolean;

  @ApiPropertyOptional()
  spirale: boolean;

  @ApiPropertyOptional()
  instrumente: boolean;

  @ApiPropertyOptional()
  soaring: boolean;

  @ApiPropertyOptional()
  thermik: boolean;

  @ApiPropertyOptional()
  landevolte: boolean;

  @ApiPropertyOptional()
  punktlandung: boolean;

  @ApiPropertyOptional()
  rueckenwindlandung: boolean;

  @ApiPropertyOptional()
  traggurtenLandung: boolean;

  @ApiPropertyOptional()
  hanglandung: boolean;

  @ApiPropertyOptional()
  touchAndGo: boolean;

  @ApiPropertyOptional()
  examProgramme: boolean;
}
