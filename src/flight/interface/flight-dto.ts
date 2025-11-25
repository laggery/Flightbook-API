import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { GliderDto } from "../../glider/interface/glider-dto";
import { PlaceDto } from "../../place/interface/place-dto";
import { Igc } from "./igc";
import { FlightValidationDto } from "./flight-validation-dto";

@Exclude()
export class FlightDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly number: number;
    @ApiProperty()
    @Expose()
    @Type(() => GliderDto)
    readonly glider: GliderDto;
    @ApiProperty()
    @Expose()
    readonly date: string;
    @ApiPropertyOptional()
    @Expose()
    // @Type(() => PlaceDto)
    readonly start?: PlaceDto;
    @ApiPropertyOptional()
    @Expose()
    // @Type(() => PlaceDto)
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
    
    @ApiPropertyOptional()
    @Expose()
    @Type(() => FlightValidationDto)
    readonly validation: FlightValidationDto;
}
