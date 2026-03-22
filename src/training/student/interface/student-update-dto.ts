import { ApiProperty } from "@nestjs/swagger";

export class StudentUpdateDto {
    @ApiProperty()
    public isAppointmentActive?: boolean;
}
