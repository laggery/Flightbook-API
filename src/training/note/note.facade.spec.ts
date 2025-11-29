import { NoteFacade } from './note.facade';
import { NoteRepository } from './note.repository';
import { StudentRepository } from '../student/student.repository';

describe('NoteFacade', () => {
  let facade: NoteFacade,
      noteRepository: jest.Mocked<NoteRepository>,
      studentRepository: jest.Mocked<StudentRepository>;

  beforeAll(async () => {
    noteRepository = {} as any;
    studentRepository = {} as any;
    facade = new NoteFacade(noteRepository, studentRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
