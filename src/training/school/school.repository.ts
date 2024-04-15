import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './school.entity';

@Injectable()
export class SchoolRepository extends Repository<School> {

    constructor(
        @InjectRepository(School)
        private readonly repository: Repository<School>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getSchoolByName(name: string): Promise<School> {
        if (!name) {
            return undefined;
        }
        return this.findOneBy({ name: name });
    }

    async getSchoolById(id: number): Promise<School> {
        if (!id) {
            return undefined;
        }
        return this.findOneBy({ id: id });
    }
}
