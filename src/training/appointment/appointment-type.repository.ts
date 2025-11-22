import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { AppointmentType } from './appointment-type.entity';

@Injectable()
export class AppointmentTypeRepository extends Repository<AppointmentType> {

    constructor(
        @InjectRepository(AppointmentType)
        repository: Repository<AppointmentType>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getAppointmentTypesBySchoolId(schoolId: number, query: any): Promise<AppointmentType[]> {
        let options: FindManyOptions<AppointmentType> = {
            relations: {
                school: true,
                instructor: true
            },
            where: {
                school: {
                    id: schoolId
                }
            },
            order: {
                name: "ASC"
            },
        }

        options = this.addQueryParams(options, query);


        return this.find(options);
    }

    async getAppointmentTypesById(id: number): Promise<AppointmentType | undefined> {
        if (!id) {
            return undefined;
        }
        return this.findOne({
            where: {
                id: id
            }
        });
    }

    private addQueryParams(options: FindManyOptions<AppointmentType>, query: any): FindManyOptions<AppointmentType> {
        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            options.take = query.limit;
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            options.skip = query.offset;
        }

        if (query && query.archived) {
            options.where["archived"] = query.archived;
        }
        return options;
    }
}
