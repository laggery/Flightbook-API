import { Exclude, Expose } from "class-transformer";
import { LoginType } from "../login-type";

@Exclude()
export class UserReadDto {

    constructor(email: string, firstname: string, lastname: string, phone: string, loginType?: LoginType) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.loginType = loginType;
    }

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
