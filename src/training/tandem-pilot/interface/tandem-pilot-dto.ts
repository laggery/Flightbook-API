import { Exclude, Expose, Type } from "class-transformer";
import { UserReadIdDto } from "../../../user/interface/user-read-id-dto";

@Exclude()
export class TandemPilotDto {
    @Expose()
    public id: number;
    
    @Expose()
    @Type(() => UserReadIdDto)
    public user: UserReadIdDto;
    
    @Expose()
    public isArchived: boolean;
}
