import { FlightDto } from "src/flight/interface/flight-dto";
import { FlightStatisticDto } from "src/flight/interface/flight-statistic-dto";
import { UserReadDto } from "src/user/interface/user-read-dto";

export class StudentDto {
    public user: UserReadDto;
    public statistic: FlightStatisticDto | FlightStatisticDto[];
    public lastFlight: FlightDto;
}
