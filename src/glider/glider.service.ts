import { Injectable, BadRequestException } from '@nestjs/common';
import { Glider } from './glider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class GliderService {

    constructor(
        @InjectRepository(Glider)
        private readonly gliderRepository: Repository<Glider>
    ) { }

    async getGliders(token: any, query: any): Promise<Glider[]> {

        let builder: SelectQueryBuilder<Glider> = this.gliderRepository.createQueryBuilder('glider')
            .addSelect('count(flight.id)', "glider_nbFlights")
            .addSelect('Sum(Time_to_sec(flight.time))', "glider_time")
            .leftJoin('flight', 'flight', 'flight.glider_id = glider.id')
            .where(`glider.user_id = ${token.userId}`)
            .groupBy('glider.id')
            .orderBy({
                brand: 'ASC',
                name: 'ASC'
            });

        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            };
            builder.limit(query.limit);
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            };
            builder.offset(query.offset);
        }

        if (query && query.brand) {
            builder.andWhere(`glider.brand LIKE '%${query.brand}%'`)
        }

        if (query && query.name) {
            builder.andWhere(`glider.name LIKE '%${query.name}%'`)
        }

        if (query && query.type) {
            if (Number.isNaN(Number(query.type))) {
                throw new BadRequestException("type is not a 0 or 1");
            };
            builder.andWhere(`glider.tandem = ${query.type}`)
        }
        return await builder.getMany();
    }

    async saveGlider(glider: Glider): Promise<Glider | undefined> {
        return await this.gliderRepository.save(glider);
    }

    async removePlace(glider: Glider): Promise<Glider | undefined> {
        return await this.gliderRepository.remove(glider);
    }

    async getGliderById(token: any, id: number): Promise<Glider> {
        return this.gliderRepository.findOneOrFail({ id: id, user: { id: token.userId } });
    }
}
