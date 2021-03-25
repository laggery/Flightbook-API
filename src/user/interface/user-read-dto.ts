import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserReadDto {
    @Expose()
    readonly email: string;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
}
