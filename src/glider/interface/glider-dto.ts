import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GliderDto {
    @ApiPropertyOptional()
    @Expose()
    readonly id: number;
    @ApiPropertyOptional()
    @Expose()
    readonly buyDate?: string;
    @ApiProperty()
    @Expose()
    readonly brand: string;
    @ApiProperty()
    @Expose()
    readonly name: string;
    @ApiProperty()
    @Expose()
    readonly tandem: boolean;
    @ApiPropertyOptional()
    @Expose()
    readonly archived: boolean;
    @ApiPropertyOptional()
    @Expose()
    readonly note?: string;
    @Expose()
    readonly nbFlights: number;
    @Expose()
    readonly time: number;
}
