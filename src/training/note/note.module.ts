import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { NoteRepository } from './note.repository';
import { NoteFacade } from './note.facade';
import { StudentModule } from '../student/student.module';

@Module({
    imports: [TypeOrmModule.forFeature([Note]), StudentModule],  
    providers: [NoteRepository, NoteFacade],
    exports: [NoteRepository, NoteFacade],
    controllers: []
})
export class NoteModule {}
