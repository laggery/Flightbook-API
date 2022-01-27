import { Exclude, Expose } from "class-transformer";
import { IsEmail } from 'class-validator';

@Exclude()
export class EnrollmentWriteDto {
    @IsEmail()
    @Expose()
    readonly email: string;
}
