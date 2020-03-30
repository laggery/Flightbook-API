import { Injectable, BadRequestException } from '@nestjs/common';
import { Glider } from './glider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GliderService {

    constructor(
        @InjectRepository(Glider)
        private readonly gliderRepository: Repository<Glider>
    ) { }

    async getGliders(token: any, query: any): Promise<Glider[]> {
        let options: any = {
            where: {
                user: {
                    id: token.userId
                }
            },
            order: {
                brand: 'ASC',
                name: 'ASC'
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

        return await this.gliderRepository.find(options);
    }

    async saveGlider(glider: Glider): Promise<Glider | undefined> {
        return await this.gliderRepository.save(glider);
    }

    async removePlace(glider: Glider): Promise<Glider | undefined> {
        return await this.gliderRepository.remove(glider);
    }

    async getGliderById(token: any, id: number): Promise<Glider> {
        return this.gliderRepository.findOneOrFail({id: id, user: {id: token.userId }});
    }
}
