import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { UserReadDto } from "../../user/interface/user-read-dto";
import { SchoolDto } from "../../training/school/interface/school-dto";

/**
 * Flight validation DTO
 * Contains information about flight validation by a school
 */
export class FlightValidationDto {
  @ApiPropertyOptional()
  @Expose()
  @Type(() => UserReadDto)
  readonly instructor: UserReadDto | null;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => SchoolDto)
  readonly school: SchoolDto | null;

  @ApiPropertyOptional()
  @Expose()
  readonly timestamp: Date | null;
}
