import {CountryDto} from "./country-dto";

export class FlightStatisticDto {
    public year: string;
    public nbFlights: number;
    public time: number;
    public income: number;
    public average: number;
    public nbStartplaces: number;
    public nbLandingplaces: number;
    public totalDistance: string;
    public bestDistance: string;
    public countries: CountryDto[];
}
