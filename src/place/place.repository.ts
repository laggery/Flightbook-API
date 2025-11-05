import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Place } from './place.entity';

@Injectable()
export class PlaceRepository extends Repository<Place> {

    constructor(
        @InjectRepository(Place)
        private readonly repository: Repository<Place>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

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

        return await this.repository.find(options);
    }

    async getPlaceById(token: any, id: number) {
        return this.repository.findOneByOrFail({ id: id, user: { id: token.userId } });
    }

    async getPlaceByName(token: any, name: string) {
        return this.repository.findOneBy({ name: name, user: { id: token.userId } });
    }

    async getPlaceByNameCaseInsensitive(token: any, name: string): Promise<Place> {
        return this.repository.createQueryBuilder("place")
        .where("place.name ILIKE :name", { name })
        .andWhere("place.user.id = :userId", { userId: token.userId })
        .getOne();
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
        return this.repository.find(options);
    }

    async convertEpsg4326toEpsg3857(coordinates: any) {
        return await this.manager.query(`select ST_AsGeoJSON(ST_Transform(ST_Point(${coordinates[0]},${coordinates[1]}, 4326),3857));`);
    }
}
