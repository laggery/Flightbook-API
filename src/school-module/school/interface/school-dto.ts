import { Exclude, Expose } from "class-transformer";
import { IsEmail } from 'class-validator';

@Exclude()
export class SchoolDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly name: string;
    @Expose()
    readonly address1: string;
    @Expose()
    readonly address2: string;
    @Expose()
    readonly plz: string;
    @Expose()
    readonly city: string;
    @Expose()
    readonly phone: string;
    @IsEmail()
    @Expose()
    readonly email: string;
}
