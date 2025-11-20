import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { removeIds } from '../utils/snapshot-utils';
import { NoteDto } from '../../src/training/note/interface/note-dto';
import { plainToClass } from 'class-transformer';

describe('instructor note (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/instructor/students/:id/notes (GET)', async () => {
    // given
    const { student, instructorUser } = await testInstance.createSchoolData();
    const note = Testdata.createNote(student);
    await testInstance.noteRepository.save(note);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/instructor/students/${student.id}/notes`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot({
          entity: [
            {
              timestamp: expect.any(String)
            }
          ]
        });
      });
  });

  it('/instructor/students/:id/notes (POST)', async () => {
    // given
    const { student, instructorUser } = await testInstance.createSchoolData();
    const noteDto = Testdata.createNoteDto(student);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/instructor/students/${student.id}/notes`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(noteDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot({
          timestamp: expect.any(String),
          student: {
            timestamp: expect.any(String)
          }
        });

        const db = await testInstance.noteRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toBeDefined();
        expect(db.id).toEqual(response.body.id);
        expect(db.text).toEqual("note");
        expect(db.title).toEqual("title");
        expect(db.date).toBeDefined();
        expect(db.timestamp).toBeDefined();
      });
  });

  it('/instructor/students/:id/notes (PUT)', async () => {
    // given
    const { student, instructorUser } = await testInstance.createSchoolData();
    const note = Testdata.createNote(student);
    await testInstance.noteRepository.save(note);
    const noteDto = plainToClass(NoteDto, note);
    noteDto.title = "new title";
    noteDto.text = "new text";

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/instructor/students/${student.id}/notes/${note.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(noteDto)
      .expect(200)
      .then(async (response) => {
        expect(response.body.id).toBeDefined();
        expect(removeIds(response.body)).toMatchSnapshot({
          timestamp: expect.any(String),
          student: {
            timestamp: expect.any(String)
          }
        });

        const db = await testInstance.noteRepository.findOne({
          where: { id: response.body.id }
        });
        expect(db).toBeDefined();
        expect(db.id).toEqual(response.body.id);
        expect(db.text).toEqual("new text");
        expect(db.title).toEqual("new title");
        expect(db.date).toBeDefined();
        expect(db.timestamp).toBeDefined();
      });
  });

  it('/instructor/students/:id/notes/:noteId (DELETE)', async () => {
    // given
    const { student, instructorUser } = await testInstance.createSchoolData();
    const note = Testdata.createNote(student);
    await testInstance.noteRepository.save(note);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/instructor/students/${student.id}/notes/${note.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.noteRepository.count();
        expect(db).toBe(0);
      });
  });
});