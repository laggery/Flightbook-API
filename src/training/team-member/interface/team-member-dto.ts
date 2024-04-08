import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { UserReadIdDto } from "../../../user/interface/user-read-id-dto";

@Exclude()
export class TeamMemberDto {
    @ApiPropertyOptional()
    @Expose()
    id: number;

    @ApiPropertyOptional()
    @Expose()
    user: UserReadIdDto;

    @ApiPropertyOptional()
    @Expose()
    admin: boolean;
}
