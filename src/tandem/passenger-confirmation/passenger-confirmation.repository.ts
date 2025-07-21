import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { PassengerConfirmation } from './passenger-confirmation.entity';
@Injectable()
export class PassengerConfirmationRepository extends Repository<PassengerConfirmation> {

    constructor(
        @InjectRepository(PassengerConfirmation)
        private readonly repository: Repository<PassengerConfirmation>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getPassengerConfirmationById(id: number, userId: number): Promise<PassengerConfirmation> {
        let passengerConfirmation = await this.findOneByOrFail({ id: id, user: { id: userId } });
        return passengerConfirmation;
    }

    async getPassengerConfirmation(userId: number, query: any): Promise<[PassengerConfirmation[], number]> {
            const options: any = {
                relations: {
                    user: true,
                },
                where: {
                    user: {
                        id: userId
                    }
                },
                order: {
                    date: 'DESC'
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
    
            if (query && query.from && query.to) {
                options.where.date = Between(`${query.from}`, `${query.to} 23:59:00.000000`);
            } else if (query && query.from) {
                options.where.scheduling = MoreThanOrEqual(query.from);
            } else if (query && query.to) {
                options.where.scheduling = LessThanOrEqual(query.to);
            }
    
            let entityNumber: [PassengerConfirmation[], number] = await this.findAndCount(options);
            return entityNumber;
        }
}
