import { TestBed } from '@automock/jest';
import { NoteFacade } from './note.facade';
import { NoteRepository } from './note.repository';
import { StudentRepository } from '../student/student.repository';

describe('NoteFacade', () => {
  let facade: NoteFacade,
      noteRepository: jest.Mocked<NoteRepository>,
      studentRepository: jest.Mocked<StudentRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(NoteFacade).compile();

    facade = unit;
    noteRepository = unitRef.get(NoteRepository);
    studentRepository = unitRef.get(StudentRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
