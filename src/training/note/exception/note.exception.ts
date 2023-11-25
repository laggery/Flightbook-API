import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";

export class NoteException {

    public static invalidNote() {
        throw new UnprocessableEntityException("Invalid note: date and title must be provided")
    }

    public static notFoundException() {
        throw new NotFoundException("Note not found")
    }
}
