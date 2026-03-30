import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { SchoolConfig } from "../domain/school-config";

@Exclude()
export class SchoolDto {
    @ApiPropertyOptional()
    @Expose()
    readonly id: number;
    @ApiProperty()
    @Expose()
    readonly name: string;
    @ApiProperty()
    @Expose()
    readonly address1: string;
    @ApiPropertyOptional()
    @Expose()
    readonly address2: string;
    @ApiProperty()
    @Expose()
    readonly plz: string;
    @ApiProperty()
    @Expose()
    readonly city: string;
    @ApiProperty()
    @Expose()
    readonly phone: string;
    @ApiProperty()
    @IsEmail()
    @Expose()
    readonly email: string;
    @ApiProperty()
    @Expose()
    readonly language: string;
    @ApiPropertyOptional({ type: SchoolConfig })
    @Expose()
    @ValidateNested()
    @IsOptional()
    @Type(() => SchoolConfig)
    readonly configuration?: SchoolConfig
}
