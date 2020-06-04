import { Injectable, BadRequestException } from '@nestjs/common';
import { Flight } from './flight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FlightService {

    constructor(
        @InjectRepository(Flight)
        private readonly flightRepository: Repository<Flight>
    ) { }

    async getFLights(token: any, query: any): Promise<Flight[]> {
        let builder = this.flightRepository.createQueryBuilder('flight')
            .addSelect('user')
            .leftJoin('flight.user', 'user', 'user.id = flight.user_id')
            .leftJoinAndSelect('flight.glider', 'glider', 'glider.id = flight.glider_id')
            .leftJoinAndSelect('flight.start', 'start', 'start.id = flight.start_id')
            .leftJoinAndSelect('flight.landing', 'landing', 'landing.id = flight.landing_id')
            .where(`user.id = ${token.userId}`)

        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            };
            builder.take(query.limit)
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            };
            builder.skip(query.offset);
        }

        if (query && query.glider) {
            if (Number.isNaN(Number(query.glider))) {
                throw new BadRequestException("glider is not a number");
            };
            builder.andWhere(`glider.id = ${query.glider}`);
        }

        if (query && query["glider-type"]) {
            if (Number.isNaN(Number(query["glider-type"]))) {
                throw new BadRequestException("type is not a 0 or 1");
            };
            builder.andWhere(`glider.tandem = ${query["glider-type"]}`)
        }

        if (query && query.from) {
            builder.andWhere(`flight.date >= "${query.from}"`);
        }

        if (query && query.to) {
            builder.andWhere(`flight.date <= "${query.to}"`);
        }

        builder.orderBy('flight.date', 'DESC');
        builder.addOrderBy('flight.timestamp', 'DESC');

        return builder.getMany();
    }

    async saveFlight(flight: Flight): Promise<Flight | undefined> {
        return await this.flightRepository.save(flight);
    }

    async removeFlight(flight: Flight): Promise<Flight | undefined> {
        return await this.flightRepository.remove(flight);
    }

    async getFlightById(token: any, id: number): Promise<Flight> {
        return this.flightRepository.findOneOrFail({ id: id, user: { id: token.userId } });
    }
}
