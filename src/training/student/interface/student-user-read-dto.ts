import { Exclude, Expose } from "class-transformer";
import { LoginType } from "src/user/login-type";

@Exclude()
export class StudentUserReadDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly email: string;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
    @Expose()
    readonly loginType: LoginType;
}
