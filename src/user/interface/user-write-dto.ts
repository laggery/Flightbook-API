import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserWriteDto {
    @Expose()
    readonly email: string;
    @Expose()
    readonly password: string;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
}
