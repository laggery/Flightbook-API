import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PlaceDto {
    @Expose()
    readonly id: number;
    @ApiProperty()
    @Expose()
    readonly name: string;
    @ApiPropertyOptional()
    @Expose()
    readonly altitude?: number;
    @ApiPropertyOptional()
    @Expose()
    readonly country?: string;
}
