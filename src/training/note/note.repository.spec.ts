import { NoteRepository } from './note.repository';
import { TestBed } from '@automock/jest';

describe('Note Repository', () => {
  let noteRepository: NoteRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(NoteRepository).compile();

    noteRepository = unit;
  });

  it('should be defined', () => {
    expect(noteRepository).toBeDefined();
  });
});
