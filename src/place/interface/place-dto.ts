import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { Position } from "geojson";

@Exclude()
export class PlaceDto {
    @Expose()
    id: number;
    @ApiProperty()
    @Expose()
    name: string;
    @ApiPropertyOptional()
    @Expose()
    altitude?: number;
    @ApiPropertyOptional()
    @Expose()
    coordinates?: Position;
    @ApiPropertyOptional()
    @Expose()
    country?: string;
    @ApiPropertyOptional()
    @Expose()
    notes?: string;
}
