import {Exclude, Expose} from "class-transformer";
import {State} from "../state";
import {SchoolDto} from "../../../school/interface/school-dto";
import {UserReadDto} from "../../../user/interface/user-read-dto";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

@Exclude()
export class AppointmentDto {
    @Expose()
    readonly id: number;

    @Expose()
    @ApiProperty()
    readonly scheduling: Date;

    @Expose()
    @ApiProperty()
    readonly meetingPoint: string;

    @Expose()
    @ApiProperty()
    readonly maxPeople: number;

    @Expose()
    @ApiPropertyOptional()
    readonly description: string;

    @Expose()
    @ApiProperty()
    readonly state: State;

    @Expose()
    @ApiProperty()
    readonly school: SchoolDto;

    @Expose()
    @ApiProperty()
    instructor: UserReadDto;

    @Expose()
    @ApiProperty()
    takeOffCoordinator: UserReadDto;
}
