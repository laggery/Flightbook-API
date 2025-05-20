import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { UserReadDto } from "../../user/interface/user-read-dto";
import { SchoolDto } from "../../training/school/interface/school-dto";
import { FlightValidationState } from "../flight-validation-state";

/**
 * Flight validation DTO
 * Contains information about flight validation by a school
 */
export class FlightValidationDto {
  @ApiPropertyOptional()
  @Expose()
  readonly state: FlightValidationState | null;

  @ApiPropertyOptional()
  @Expose()
  readonly comment: string | null;

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
