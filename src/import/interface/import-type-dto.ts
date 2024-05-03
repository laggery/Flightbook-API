import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ImportTypeDto {
    @Expose()
    type: string;
    @Expose()
    name: string;
    @ApiPropertyOptional()
    @Expose()
    description: string;
}
