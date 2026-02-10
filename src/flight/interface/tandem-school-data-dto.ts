import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { UserReadDto } from "../../user/interface/user-read-dto";
import { SchoolDto } from "../../training/school/interface/school-dto";
import { TandemSchoolPaymentState } from "../tandem-school-payment-state";

/**
 * Tandem school data DTO
 * Contains information about tandem school
 */
export class TandemSchoolDataDto {
  @ApiPropertyOptional()
  @Expose()
  readonly paymentState: TandemSchoolPaymentState | null;

  @ApiPropertyOptional()
  @Expose()
  readonly paymentComment: string | null;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => UserReadDto)
  readonly instructor: UserReadDto | null;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => SchoolDto)
  readonly tandemSchool: SchoolDto | null;

  @ApiPropertyOptional()
  @Expose()
  readonly paymentTimestamp: Date | null;
}
