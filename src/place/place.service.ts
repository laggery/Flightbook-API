import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './place.entity';

@Injectable()
export class PlaceService {

    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>
    ) { }

    async getPlaces(query: any): Promise<any> {
        // TODO change user id from token
        let options: any = {
            where: {
                user: {
                    id: 1
                }
            },
            order: {
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

        return await this.placeRepository.find(options);
    }

    async addPlace(place: Place) {
        return await this.placeRepository.save(place);
    }

    async updatePlace(place: Place) {
        return await this.placeRepository.save(place);
    }

    async removePlace(place: Place) {
        return await this.placeRepository.remove(place);
    }

    async getPlaceById(id: number) {
        // TODO change user id from token
        return this.placeRepository.findOneOrFail({id: id, user: {id: 1 }});
    }

    async getPlaceByName(name: string) {
        // TODO change user id from token
        return this.placeRepository.findOne({ name: name, user: {id: 1 }});
    }
}
