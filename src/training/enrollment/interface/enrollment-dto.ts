import { Exclude, Expose } from "class-transformer";
import { IsEmail } from 'class-validator';
import { SchoolDto } from "../../../training/school/interface/school-dto";
import { EnrollmentType } from "../enrollment-type";

@Exclude()
export class EnrollmentDto {
    @IsEmail()
    @Expose()
    readonly email: string;
    @Expose()
    readonly school: SchoolDto;
    @Expose()
    readonly token: string;
    @Expose()
    readonly expireAt: Date;
    @Expose()
    readonly type: EnrollmentType;
    @Expose()
    isUser: boolean;
}
