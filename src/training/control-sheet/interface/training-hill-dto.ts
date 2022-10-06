import { ApiPropertyOptional } from "@nestjs/swagger";

export class TrainingHillDto {
  @ApiPropertyOptional()
  auslegen: boolean;

  @ApiPropertyOptional()
  aufziehen: boolean;

  @ApiPropertyOptional()
  slalom: boolean;

  @ApiPropertyOptional()
  laufenAngebremst: boolean;

  @ApiPropertyOptional()
  vorbereitung: boolean;

  @ApiPropertyOptional()
  startphasen: boolean;

  @ApiPropertyOptional()
  richtungsaenderungen: boolean;

  @ApiPropertyOptional()
  startabbruch: boolean;

  @ApiPropertyOptional()
  seitenwindstart: boolean;

  @ApiPropertyOptional()
  schlechtAusgelegt: boolean;

  @ApiPropertyOptional()
  starts: boolean;

  @ApiPropertyOptional()
  landungen: boolean;

  @ApiPropertyOptional()
  notlandung: boolean;

  @ApiPropertyOptional()
  notschirm: boolean;

  @ApiPropertyOptional()
  kurven: boolean;

  @ApiPropertyOptional()
  entwirren: boolean;

  @ApiPropertyOptional()
  faltmethoden: boolean;
  
  @ApiPropertyOptional()
  theorietest: boolean;
}
