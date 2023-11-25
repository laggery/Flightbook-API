import { Test, TestingModule } from '@nestjs/testing';
import { NoteRepository } from './note.repository';

describe('NoteRepositoryService', () => {
  let service: NoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteRepository],
    }).compile();

    service = module.get<NoteRepository>(NoteRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
