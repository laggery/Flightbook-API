import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class ResultDto {
    @ApiPropertyOptional()
    @Expose()
    inserted: number;
    @ApiPropertyOptional()
    @Expose()
    existed: number;
    @ApiPropertyOptional()
    @Expose()
    updated: number;

    constructor() {
        this.inserted = 0;
        this.existed = 0;
        this.updated = 0;
    }
}

@Exclude()
export class ImportResultDto {
    @ApiProperty()
    @Expose()
    glider: ResultDto;
    @ApiProperty()
    @Expose()
    place: ResultDto;
    @ApiProperty()
    @Expose()
    flight: ResultDto;
}
