import { ControlSheetDto } from "src/training/control-sheet/interface/control-sheet-dto";
import { FlightDto } from "../../../flight/interface/flight-dto";
import { FlightStatisticDto } from "../../../flight/interface/flight-statistic-dto";
import { UserReadIdDto } from "../../../user/interface/user-read-id-dto";
import { NoteDto } from "src/training/note/interface/note-dto";

export class StudentDto {
    public id: number;
    public user: UserReadIdDto;
    public statistic: FlightStatisticDto;
    public lastFlight: FlightDto;
    public isArchived: boolean;
    public isTandem: boolean;
    public controlSheet: ControlSheetDto;
    public lastNote: NoteDto;
}
