import { ApiProperty } from "@nestjs/swagger";

export class MapConfigurationDto {
    @ApiProperty()
    readonly url: string;
    @ApiProperty()
    readonly attributions: string;
    @ApiProperty()
    readonly crossOrigin: string;
}
