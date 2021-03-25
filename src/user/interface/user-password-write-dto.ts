import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserPasswordWriteDto {
    @Expose()
    readonly oldPassword: string;
    @Expose()
    readonly newPassword: string;
}
