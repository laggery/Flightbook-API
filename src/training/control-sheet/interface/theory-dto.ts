import { ApiPropertyOptional } from "@nestjs/swagger";

export class TheoryDto {
  @ApiPropertyOptional()
  fluglehre: number;

  @ApiPropertyOptional()
  wetterkunde: number;

  @ApiPropertyOptional()
  flugpraxis: number;

  @ApiPropertyOptional()
  gesetzgebung: number;

  @ApiPropertyOptional()
  materialkunde: number;
}
