import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { GliderDto } from "src/glider/interface/glider-dto";
import { PlaceDto } from "src/place/interface/place-dto";
import { Igc } from "./igc";

@Exclude()
export class FlightDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly number: number;
    @ApiProperty()
    @Expose()
    readonly glider: GliderDto;
    @ApiProperty()
    @Expose()
    readonly date: string;
    @ApiPropertyOptional()
    @Expose()
    readonly start?: PlaceDto;
    @ApiPropertyOptional()
    @Expose()
    readonly landing?: PlaceDto;
    @ApiPropertyOptional()
    @Expose()
    readonly time?: string;
    @ApiPropertyOptional()
    @Expose()
    readonly km?: number;
    @ApiPropertyOptional()
    @Expose()
    readonly description?: string;
    @ApiPropertyOptional()
    @Expose()
    readonly price?: number;
    @Expose()
    readonly igc?: Igc;
    @Expose()
    readonly shvAlone: boolean;
}
