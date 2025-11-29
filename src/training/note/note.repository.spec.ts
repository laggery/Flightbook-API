import { NoteRepository } from './note.repository';
import { Repository } from 'typeorm';
import { Note } from './note.entity';

describe('Note Repository', () => {
  let noteRepository: NoteRepository;

  beforeAll(async () => {
    const repository = {} as Repository<Note>;
    noteRepository = new NoteRepository(repository);
  });

  it('should be defined', () => {
    expect(noteRepository).toBeDefined();
  });
});
