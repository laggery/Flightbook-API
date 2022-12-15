import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Place } from './place.entity';
import { PagerDto } from 'src/interface/pager-dto';

@Injectable()
export class PlaceService {

    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>
    ) { }

    async getPlaces(token: any, query: any): Promise<any> {
        const options: any = {
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
            }
            options.take = query.limit;
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            options.skip = query.offset;
        }

        return await this.placeRepository.find(options);
    }

    async getPlacesPager(token: any, query: any): Promise<PagerDto> {
        const pagerDto = new PagerDto();

        const builder = this.placeRepository.createQueryBuilder('place')
            .where(`user_id = ${token.userId}`);

        if (query?.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            builder.limit(query.limit);
        }

        if (query?.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            builder.offset(query.offset);
        }

        const entityNumber: [Place[], number] = await builder.getManyAndCount();

        pagerDto.itemCount = entityNumber[0].length;
        pagerDto.totalItems = entityNumber[1];
        pagerDto.itemsPerPage = (query && query.limit) ? Number(query.limit) : pagerDto.itemCount;
        pagerDto.totalPages =  (query && query.limit) ?  Math.ceil(pagerDto.totalItems / Number(query.limit)) : pagerDto.totalItems;
        pagerDto.currentPage = (query && query.offset) ? (query.offset >= pagerDto.totalItems ? null : Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1) : 1;
        return pagerDto;
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
        return this.placeRepository.findOneByOrFail({ id: id, user: { id: token.userId } });
    }

    async getPlaceByName(token: any, name: string) {
        return this.placeRepository.findOneBy({ name: name, user: { id: token.userId } });
    }

    async getPlacesByName(token: any, query: any, name: string) {
        const options: any = {
            where: {
                user: {
                    id: token.userId
                },
                name: ILike("%" + name + "%")
            },
            order: {
                name: 'ASC'
            }
        };
        if (query?.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            options.take = query.limit;
        }

        if (query?.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            options.skip = query.offset;
        }
        return this.placeRepository.find(options);
    }
}
