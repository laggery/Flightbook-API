import { plainToInstance } from "class-transformer";
import { Note } from "./note.entity";
import { NoteDto } from "./interface/note-dto";

export class NoteMapper {

    public static toNoteDtoList(notes: Note[]): NoteDto[] {
        const noteDtoList = [];
        notes.forEach((note: Note) => {
            noteDtoList.push(this.toNoteDto(note));
        })
        return noteDtoList
    }

    public static toNoteDto(note: Note): NoteDto {
        const noteDto: NoteDto = plainToInstance(NoteDto, note);
        return noteDto
    }
}
