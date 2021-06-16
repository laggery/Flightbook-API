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
        return this.schoolRepository.findOne({ name: name });
    }

    async getSchoolById(id: number): Promise<School> {
        return this.schoolRepository.findOne({ id: id });
    }
}
