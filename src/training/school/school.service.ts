import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './school.entity';

@Injectable()
export class SchoolService {

    constructor(
        @InjectRepository(School)
        private readonly schoolRepository: Repository<School>
    ) { }

    async saveSchool(school: School): Promise<School | undefined> {
        return await this.schoolRepository.save(school);
    }

    async getSchoolByName(name: string): Promise<School> {
        if (!name) {
            return undefined;
        }
        return this.schoolRepository.findOneBy({ name: name });
    }

    async getSchoolById(id: number): Promise<School> {
        if (!id) {
            return undefined;
        }
        return this.schoolRepository.findOneBy({ id: id });
    }
}
