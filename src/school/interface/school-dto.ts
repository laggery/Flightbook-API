import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail } from 'class-validator';

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
}
