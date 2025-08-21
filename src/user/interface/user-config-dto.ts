import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

@Expose()
export class LinkDto {
  @ApiProperty()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsNotEmpty()
  label: string;
}

@Expose()
export class PreparationDto {
  @ApiPropertyOptional()
  shvLinkDisabled?: boolean;

  @ApiPropertyOptional()
  dabsLinkDisabled?: boolean;

  @ApiPropertyOptional({ type: [LinkDto] })
  @ValidateNested()
  @IsOptional()
  @Type(() => LinkDto)
  links?: LinkDto[];
}

@Expose()
export class UserConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => PreparationDto)
  preparation?: PreparationDto;
}