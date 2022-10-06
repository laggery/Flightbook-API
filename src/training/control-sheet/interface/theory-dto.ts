import { ApiPropertyOptional } from "@nestjs/swagger";

export class TheoryDto {
  @ApiPropertyOptional()
  fluglehre: boolean;

  @ApiPropertyOptional()
  wetterkunde: boolean;

  @ApiPropertyOptional()
  flugpraxis: boolean;

  @ApiPropertyOptional()
  gesetzgebung: boolean;

  @ApiPropertyOptional()
  materialkunde: boolean;
}
