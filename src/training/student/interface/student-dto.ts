import { FlightDto } from "../../../flight/interface/flight-dto";
import { FlightStatisticDto } from "../../../flight/interface/flight-statistic-dto";
import { UserReadIdDto } from "../../../user/interface/user-read-id-dto";

export class StudentDto {
    public id: number;
    public user: UserReadIdDto;
    public statistic: FlightStatisticDto;
    public lastFlight: FlightDto;
    public isArchived: boolean;
}
