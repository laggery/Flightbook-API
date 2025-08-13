import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsNotEmpty, ValidateNested } from "class-validator";

@Exclude()
export class GliderCheckDto {
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    readonly date: Date;
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    readonly result: string;
}

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
    @ApiPropertyOptional({ type: [GliderCheckDto] })
    @Expose()
    @ValidateNested()
    @Type(() => GliderCheckDto)
    readonly checks?: GliderCheckDto[];
}
