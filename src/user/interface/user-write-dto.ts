import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { UserConfigDto } from "./user-config-dto";

@Exclude()
export class UserWriteDto {
    @ApiProperty()
    @IsEmail()
    @Expose()
    readonly email: string;
    @ApiProperty()
    @Expose()
    readonly password: string;
    @ApiProperty()
    @Expose()
    readonly firstname: string;
    @ApiProperty()
    @Expose()
    readonly lastname: string;
    @ApiProperty()
    @Expose()
    readonly phone: string;
    @ApiPropertyOptional({ type: UserConfigDto })
    @Expose()
    @ValidateNested()
    @IsOptional()
    @Type(() => UserConfigDto)
    readonly config?: UserConfigDto
}
