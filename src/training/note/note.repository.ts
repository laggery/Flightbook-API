import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PagerEntityDto } from 'src/interface/pager-entity-dto';

@Injectable()
export class NoteRepository extends Repository<Note> {

    constructor(
        @InjectRepository(Note)
        repository: Repository<Note>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getNoteById(id: number): Promise<Note> {
        return this.findOneByOrFail({ id: id });
    }

    async getNotesByStudentId(studentId: number): Promise<Note[]> {
        return this.findBy({ student: {
            id: studentId
        }});
    }

    async getNotesByArchivedStudentId(studentId: number): Promise<Note[]> {
        return this.findBy({ archivedStudent: {
            id: studentId
        }});
    }

    async getNotesPager(studentId: number, query: any): Promise<PagerEntityDto<Note[]>> {
        const pagerDto = new PagerEntityDto<Note[]>();

        let builder = this.createQueryBuilder('note')
            .where(`note.student_id = ${studentId}`)
            .orWhere(`note.archivedstudent_id = ${studentId}`)
            .orderBy({
                date: 'DESC'
            });

        builder = NoteRepository.addQueryParams(builder, query);
        const entityNumber: [Note[], number] = await builder.getManyAndCount();

        pagerDto.itemCount = entityNumber[0].length;
        pagerDto.totalItems = entityNumber[1];
        pagerDto.itemsPerPage = (query?.limit) ? Number(query.limit) : pagerDto.itemCount;
        pagerDto.totalPages = (query?.limit) ? Math.ceil(pagerDto.totalItems / Number(query.limit)) : pagerDto.totalItems;
        pagerDto.currentPage = (query?.offset) ? (query.offset >= pagerDto.totalItems ? null : Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1) : 1;
        pagerDto.entity = entityNumber[0];
        return pagerDto;
    }

    private static addQueryParams(builder: SelectQueryBuilder<any>, query: any): SelectQueryBuilder<any> {
        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            builder.take(query.limit)
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            builder.skip(query.offset);
        }

        if (query && query.from) {
            builder.andWhere(`note.date >= '${query.from}'`);
        }

        if (query && query.to) {
            builder.andWhere(`note.date <= '${query.to}'`);
        }

        if (query && query.description) {
            builder.andWhere(`note.text ILIKE '%${query.text}%'`);
        }
        return builder
    }
}
