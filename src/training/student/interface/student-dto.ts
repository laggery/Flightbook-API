import { FlightDto } from "src/flight/interface/flight-dto";
import { FlightStatisticDto } from "src/flight/interface/flight-statistic-dto";
import { UserReadIdDto } from "src/user/interface/user-read-id-dto";

export class StudentDto {
    public user: UserReadIdDto;
    public statistic: FlightStatisticDto | FlightStatisticDto[];
    public lastFlight: FlightDto;
}
