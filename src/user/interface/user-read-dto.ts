import { Exclude, Expose } from "class-transformer";
import { LoginType } from "../login-type";

@Exclude()
export class UserReadDto {
    @Expose()
    readonly email: string;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
    @Expose()
    readonly loginType: LoginType;
}
