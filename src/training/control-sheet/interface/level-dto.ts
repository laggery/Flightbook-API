import { ApiPropertyOptional } from "@nestjs/swagger";

export class LevelDto {
  @ApiPropertyOptional()
  start: number;

  @ApiPropertyOptional()
  maneuver: number;

  @ApiPropertyOptional()
  landing: number;
}
