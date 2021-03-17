import { Injectable, BadRequestException } from '@nestjs/common';
import { Glider } from './glider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PagerDto } from 'src/interface/pager-dto';

@Injectable()
export class GliderService {

    constructor(
        @InjectRepository(Glider)
        private readonly gliderRepository: Repository<Glider>
    ) { }

    async getGliders(token: any, query: any): Promise<Glider[]> {

        let builder: SelectQueryBuilder<Glider> = this.gliderRepository.createQueryBuilder('glider')
            .addSelect('count(flight.id)', "glider_nbFlights")
            .addSelect('EXTRACT(EPOCH FROM Sum(flight.time))', "glider_time")
            .leftJoin('flight', 'flight', 'flight.glider_id = glider.id')
            .where(`glider.user_id = ${token.userId}`)
            .groupBy('glider.id')
            .orderBy({
                brand: 'ASC',
                name: 'ASC'
            });

        builder = this.addQueryParams(builder, query);

        return await builder.getMany();
    }

    async getGlidersPager(token: any, query: any): Promise<PagerDto> {
        let pagerDto = new PagerDto();

        let builder = this.gliderRepository.createQueryBuilder('glider')
            .where(`user_id = ${token.userId}`);

        builder = this.addQueryParams(builder, query);
        let entityNumber: [Glider[], number] = await builder.getManyAndCount();

        pagerDto.itemCount = entityNumber[0].length;
        pagerDto.totalItems = entityNumber[1];
        pagerDto.itemsPerPage = (query && query.limit) ? Number(query.limit) : pagerDto.itemCount;
        pagerDto.totalPages =  (query && query.limit) ?  Math.ceil(pagerDto.totalItems / Number(query.limit)) : pagerDto.totalItems;
        pagerDto.currentPage = (query && query.offset) ? (query.offset >= pagerDto.totalItems ? null : Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1) : 1;
        return pagerDto;
    }

    private addQueryParams(builder: SelectQueryBuilder<Glider>, query: any): SelectQueryBuilder<Glider> {
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
            builder.andWhere(`glider.brand ILIKE '%${query.brand}%'`)
        }

        if (query && query.name) {
            builder.andWhere(`glider.name ILIKE '%${query.name}%'`)
        }

        if (query && query.type) {
            if (Number.isNaN(Number(query.type))) {
                throw new BadRequestException("type is not a 0 or 1");
            };
            builder.andWhere(`glider.tandem = ${query.type}`)
        }
        return builder
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
