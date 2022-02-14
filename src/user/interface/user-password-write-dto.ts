import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserPasswordWriteDto {
    @ApiProperty()
    @Expose()
    readonly oldPassword: string;
    @ApiProperty()
    @Expose()
    readonly newPassword: string;
}
