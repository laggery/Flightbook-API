import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

@Expose()
export class GoogleCalendarConfig {
  @Exclude()
  @ApiProperty()
  @IsOptional()
  @IsString()
  accessToken: string;

  @Exclude()
  @ApiProperty()
  @IsOptional()
  @IsString()
  refreshToken: string;

  @Expose()
  @ApiProperty()
  @IsOptional()
  @IsString()
  calendarId: string;

  @Exclude()
  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  tokenExpiry: Date;
}

export enum CustomFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  DROPDOWN = 'dropdown'
}

@Expose()
export class CustomFieldDefinition {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty({ enum: CustomFieldType })
  @IsEnum(CustomFieldType)
  type: CustomFieldType;

  @ApiProperty()
  @IsBoolean()
  required: boolean;

  @ApiProperty()
  @IsBoolean()
  disabled: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];
}

@Expose()
export class FlightConfig {
  @ApiProperty({ type: [CustomFieldDefinition] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldDefinition)
  customFields: CustomFieldDefinition[];
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

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => FlightConfig)
  flightConfig?: FlightConfig;
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

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => GoogleCalendarConfig)
  googleCalendar?: GoogleCalendarConfig;
}
