import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Place } from './place.entity';

@Injectable()
export class PlaceService {

    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>
    ) { }

    async getPlaces(token: any, query: any): Promise<any> {
        let options: any = {
            where: {
                user: {
                    id: token.userId
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

    async getPlaceById(token: any, id: number) {
        return this.placeRepository.findOneOrFail({ id: id, user: { id: token.userId } });
    }

    async getPlaceByName(token: any, name: string) {
        return this.placeRepository.findOne({ name: name, user: { id: token.userId } });
    }

    async getPlacesByName(token: any, query: any, name: string) {
        let options: any = {
            where: {
                user: {
                    id: token.userId
                },
                name: Like(`%${name}%`)
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
        return this.placeRepository.find(options);
    }
}
