import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PagerEntityDto } from 'src/interface/pager-entity-dto';
import { NoteRepository } from './note.repository';
import { NoteDto } from './interface/note-dto';
import { Student } from '../student/student.entity';
import { StudentRepository } from '../student/student.repository';
import { Note } from './note.entity';
import { NoteMapper } from './note.mapper';
import { NoteException } from './exception/note.exception';
import { StudentException } from '../student/exception/student.exception';

@Injectable()
export class NoteFacade {

    constructor(
        private noteRepository: NoteRepository,
        private studentRepository: StudentRepository
    ) { }

    async getNotesByStudentId(studentId: number, query: any): Promise<PagerEntityDto<NoteDto[]>> {
        if (!query.limit) {
            query.limit = 100;
        }

        const pagedNotes = await this.noteRepository.getNotesPager(studentId, query);

        return {
            itemCount: pagedNotes.itemCount,
            totalItems: pagedNotes.totalItems,
            itemsPerPage: pagedNotes.itemsPerPage,
            totalPages: pagedNotes.totalPages,
            currentPage: pagedNotes.currentPage,
            entity: NoteMapper.toNoteDtoList(pagedNotes.entity)
        }
    }

    async createNote(studentId: number, noteDto: NoteDto): Promise<NoteDto> {     
        let note: Note = new Note();

        note = await this.validityCheck(noteDto, studentId, note);

        const noteResp: Note = await this.noteRepository.save(note);
        return NoteMapper.toNoteDto(noteResp);
    }

    async updateNote(id: number, studentId: number, noteDto: NoteDto): Promise<NoteDto> {
        let note: Note = await this.noteRepository.getNoteById(id);

        if (!note) {
            NoteException.notFoundException();
        }

        await this.validityCheck(noteDto, studentId, note);

        const noteResp: Note = await this.noteRepository.save(note);
        return NoteMapper.toNoteDto(noteResp);
    }

    async removeNote(id: number) {
        const note = await this.noteRepository.getNoteById(id)
        if (!note) {
            throw NoteException.notFoundException();
        }
        const noteResp = await this.noteRepository.remove(note);
        return NoteMapper.toNoteDto(noteResp);
    }

    private async validityCheck(noteDto: NoteDto, studentId: number, note: Note) {
        const { date, text, title } = noteDto;

        if (!date || !text) {
            throw NoteException.invalidNote();
        }

        note.title = title === '' ? null : title;
        note.date = date;
        note.text = text;

        const studentEntity: Student = await this.studentRepository.getStudentById(studentId);

        if (!studentEntity) {
            StudentException.notFoundException();
        }

        note.student = studentEntity;

        return note;
    }
}
