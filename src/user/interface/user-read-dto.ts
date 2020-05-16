import { Exclude, Expose } from "class-transformer";
import { GliderDto } from "src/glider/interface/glider-dto";
import { PlaceDto } from "src/place/interface/place-dto";

@Exclude()
export class UserReadDto {
    @Expose()
    readonly email: string;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
}
