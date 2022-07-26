import {Exclude, Expose} from "class-transformer";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {UserReadDto} from "../../../user/interface/user-read-dto";
import {AppointmentDto} from "../../appointment/interface/appointment-dto";

@Exclude()
export class SubscriptionDto {

    @Expose()
    id: number;

    @Expose()
    @ApiPropertyOptional()
    comment: string;

    @Expose()
    @ApiProperty()
    user: UserReadDto;

    @Expose()
    appointment: AppointmentDto;

    timestamp: Date;
}
