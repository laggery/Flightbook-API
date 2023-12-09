import { ApiPropertyOptional } from "@nestjs/swagger";

export class TrainingHillDto {
  @ApiPropertyOptional()
  auslegen: number;

  @ApiPropertyOptional()
  aufziehen: number;

  @ApiPropertyOptional()
  slalom: number;

  @ApiPropertyOptional()
  laufenAngebremst: number;

  @ApiPropertyOptional()
  vorbereitung: number;

  @ApiPropertyOptional()
  startphasen: number;

  @ApiPropertyOptional()
  richtungsaenderungen: number;

  @ApiPropertyOptional()
  startabbruch: number;

  @ApiPropertyOptional()
  seitenwindstart: number;

  @ApiPropertyOptional()
  schlechtAusgelegt: number;

  @ApiPropertyOptional()
  starts: number;

  @ApiPropertyOptional()
  landungen: number;

  @ApiPropertyOptional()
  notlandung: number;

  @ApiPropertyOptional()
  notschirm: number;

  @ApiPropertyOptional()
  kurven: number;

  @ApiPropertyOptional()
  entwirren: number;

  @ApiPropertyOptional()
  faltmethoden: number;
  
  @ApiPropertyOptional()
  theorietest: number;
}
