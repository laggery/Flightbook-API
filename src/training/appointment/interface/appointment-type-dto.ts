import { ApiProperty } from "@nestjs/swagger";
import {Exclude, Expose} from "class-transformer";

@Exclude()
export class AppointmentTypeDto {
    @Expose()
    @ApiProperty()
    readonly id: number;

    @Expose()
    @ApiProperty()
    readonly name: string;

    @Expose()
    @ApiProperty()
    readonly archived: boolean;
}
