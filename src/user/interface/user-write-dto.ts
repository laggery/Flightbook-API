import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail } from 'class-validator';

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
}
