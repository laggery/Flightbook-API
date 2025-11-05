import { BadRequestException, Injectable } from '@nestjs/common';
import { Glider } from './glider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class GliderRepository extends Repository<Glider> {

    constructor(
        @InjectRepository(Glider)
        private readonly repository: Repository<Glider>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getGliders(token: any, query: any): Promise<Glider[]> {

        let builder: SelectQueryBuilder<Glider> = this.repository.createQueryBuilder('glider')
            .addSelect('count(flight.id)', "glider_nbFlights")
            .addSelect('EXTRACT(EPOCH FROM Sum(flight.time))', "glider_time")
            .leftJoin('flight', 'flight', 'flight.glider_id = glider.id')
            .where(`glider.user_id = ${token.userId}`)
            .groupBy('glider.id')
            .orderBy({
                brand: 'ASC',
                name: 'ASC'
            });

        builder = GliderRepository.addQueryParams(builder, query);

        return await builder.getMany();
    }

    async getGliderBySimilarityName(token: any, name: string): Promise<Glider> {

        let builder: SelectQueryBuilder<Glider> = this.repository.createQueryBuilder('glider')
            .addSelect(`similarity(name, '${name}')`)
            .where(`glider.user_id = ${token.userId}`)
            .orderBy({
                similarity: 'DESC'
            })
            .limit(1);

        return await builder.getOne();
    }

    async getGliderByName(token: any, name: string) {
        return this.repository.createQueryBuilder("glider")
        .where("glider.name ILIKE :name", { name })
        .andWhere("glider.user.id = :userId", { userId: token.userId })
        .getOne();
    }

    private static addQueryParams(builder: SelectQueryBuilder<Glider>, query: any): SelectQueryBuilder<Glider> {
        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            builder.limit(query.limit);
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            builder.offset(query.offset);
        }

        if (query && query.brand) {
            builder.andWhere(`glider.brand ILIKE '%${query.brand}%'`)
        }

        if (query && query.name) {
            builder.andWhere(`glider.name ILIKE '%${query.name}%'`)
        }

        if (query && query.type) {
            if (Number.isNaN(Number(query.type))) {
                throw new BadRequestException("type is not a 0 or 1");
            }
            builder.andWhere(`glider.tandem = ${!!Number(query.type)}`)
        }

        if (query && query.archived) {
            if (Number.isNaN(Number(query.archived))) {
                throw new BadRequestException("archived is not a 0 or 1");
            }
            builder.andWhere(`glider.archived = ${!!Number(query.archived)}`)
        }
        return builder
    }

    async getGliderById(token: any, id: number): Promise<Glider> {
        return this.repository.findOneByOrFail({ id: id, user: { id: token.userId } });
    }
}
