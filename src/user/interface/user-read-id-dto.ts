import { Exclude, Expose } from "class-transformer";
import { LoginType } from "../../user/login-type";

@Exclude()
export class UserReadIdDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly email: string;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
    @Expose()
    readonly phone: string;
    @Expose()
    readonly loginType: LoginType;
}
