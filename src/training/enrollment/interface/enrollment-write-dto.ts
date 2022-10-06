import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail } from 'class-validator';

@Exclude()
export class EnrollmentWriteDto {
    @ApiProperty()
    @IsEmail()
    @Expose()
    readonly email: string;
}
