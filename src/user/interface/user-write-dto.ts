import { Exclude, Expose } from "class-transformer";
import { IsEmail } from 'class-validator';

@Exclude()
export class UserWriteDto {
    @IsEmail()
    @Expose()
    readonly email: string;
    @Expose()
    readonly password: string;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
}
