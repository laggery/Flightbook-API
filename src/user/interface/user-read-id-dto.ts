import { Exclude, Expose } from "class-transformer";

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
}
