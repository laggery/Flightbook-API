import { Injectable } from '@nestjs/common';
import { Flight } from './flight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FlightService {

    constructor(
        @InjectRepository(Flight)
        private readonly flightRepository: Repository<Flight>
    ) { }

    async getFLights(): Promise<any> {
        let options: any = {
            relations: ["glider", "start", "landing"],
            where: {
                user: {
                    id: 1
                }
            },
            order: {
                date: 'DESC'
            },
            take: 10,
            skip: 1
        };

        // options.where.glider = {
        //     id: 753
        // };
        return await this.flightRepository.find(options);
    }
}
