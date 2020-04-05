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
        let options: any = {
            relations: ["glider", "start", "landing"],
            where: {
                user: {
                    id: token.userId
                }
            },
            order: {
                date: 'DESC',
                timestamp: 'DESC'
            }
        };

        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            };
            options.take = query.limit;
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            };
            options.skip = query.offset;
        }

        return await this.flightRepository.find(options);
    }

    async saveFlight(flight: Flight): Promise<Flight | undefined> {
        return await this.flightRepository.save(flight);
    }

    async removeFlight(flight: Flight): Promise<Flight | undefined> {
        return await this.flightRepository.remove(flight);
    }

    async getFlightById(token: any, id: number): Promise<Flight> {
        return this.flightRepository.findOneOrFail({id: id, user: {id: token.userId }});
    }
}
