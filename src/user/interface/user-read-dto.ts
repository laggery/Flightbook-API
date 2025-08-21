import { Exclude, Expose, Type } from "class-transformer";
import { LoginType } from "../login-type";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, ValidateNested } from "class-validator";
import { UserConfigDto } from "./user-config-dto";

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
    @ApiPropertyOptional({ type: UserConfigDto })
    @Expose()
    @ValidateNested()
    @IsOptional()
    @Type(() => UserConfigDto)
    readonly config?: UserConfigDto
}
