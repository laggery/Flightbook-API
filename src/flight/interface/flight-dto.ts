import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type, Transform } from "class-transformer";
import * as moment from "moment";
import { GliderDto } from "../../glider/interface/glider-dto";
import { PlaceDto } from "../../place/interface/place-dto";
import { Igc } from "./igc";
import { FlightValidationDto } from "./flight-validation-dto";
import { TandemSchoolDataDto } from "./tandem-school-data-dto";

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
    @Transform(({ value }) => {
        // Ensure date is always returned as YYYY-MM-DD string, never as Date object
        // This is needed to avoid timezone issues when displaying dates in the frontend
        if (!value) return null;
        if (value instanceof Date) {
            return moment(value).format('YYYY-MM-DD');
        }
        if (typeof value === 'string' && value.includes('T')) {
            return value.substring(0, 10);
        }
        return value;
    })
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
    
    @ApiPropertyOptional()
    @Expose()
    @Type(() => TandemSchoolDataDto)
    readonly tandemSchoolData: TandemSchoolDataDto;
}
