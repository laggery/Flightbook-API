import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CopyFileDto {
    @ApiProperty()
    @Expose()
    readonly sourceFileName: string;
    @ApiProperty()
    @Expose()
    readonly destinationFileName: string;
}
