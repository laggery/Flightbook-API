import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

/**
 * School configuration DTO
 */
export class SchoolConfigurationDto {
    @ApiPropertyOptional()
    @Expose()
    readonly validateFlights: boolean;

    @ApiPropertyOptional()
    @Expose()
    readonly userCanEditControlSheet: boolean;
}
