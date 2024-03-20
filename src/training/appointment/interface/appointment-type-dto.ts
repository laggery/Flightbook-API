import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {Exclude, Expose} from "class-transformer";
import { UserReadDto } from "src/user/interface/user-read-dto";

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

    @Expose()
    @ApiPropertyOptional()
    readonly color: string;

    @Expose()
    @ApiPropertyOptional()
    readonly meetingPoint: string;

    @Expose()
    @ApiPropertyOptional()
    readonly maxPeople: number;

    @Expose()
    @ApiPropertyOptional()
    instructor: UserReadDto;

    @Expose()
    @ApiPropertyOptional()
    readonly time: string;
}
