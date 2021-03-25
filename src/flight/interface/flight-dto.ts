import { Exclude, Expose } from "class-transformer";
import { GliderDto } from "src/glider/interface/glider-dto";
import { PlaceDto } from "src/place/interface/place-dto";
import { ValidationDto } from "src/schoolModule/validation/interface/validation-dto";

@Exclude()
export class FlightDto {
    @Expose()
    readonly number: number;
    @Expose()
    readonly id: number;
    @Expose()
    readonly glider: GliderDto;
    @Expose()
    readonly date: string;
    @Expose()
    readonly start?: PlaceDto;
    @Expose()
    readonly landing?: PlaceDto;
    @Expose()
    readonly time?: string;
    @Expose()
    readonly km?: number;
    @Expose()
    readonly description?: string;
    @Expose()
    readonly price?: number;
    @Expose()
    readonly validation?: ValidationDto;
}
