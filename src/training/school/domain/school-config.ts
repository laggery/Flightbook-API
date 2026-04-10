import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString, ValidateNested } from "class-validator";

@Expose()
export class GoogleCalendarConfig {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  @IsString()
  calendarId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  tokenExpiry: Date;
}

@Expose()
export class TandemModuleDto {
  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  termsAndConditionsLink?: string;
}

@Expose()
export class SchoolModuleDto {
  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @IsBoolean()
  validateFlights: boolean;

  @ApiProperty()
  @IsBoolean()
  userCanEditControlSheet: boolean;
}

@Expose()
export class SchoolConfig {

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SchoolModuleDto)
  schoolModule: SchoolModuleDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => TandemModuleDto)
  tandemModule: TandemModuleDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => GoogleCalendarConfig)
  googleCalendar?: GoogleCalendarConfig;
}
